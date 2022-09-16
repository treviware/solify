import {App, computed, ComputedRef, ref, Ref, shallowRef, watch, watchEffect} from 'vue';
import {
    Adapter,
    MessageSignerWalletAdapter,
    SendTransactionOptions,
    SignerWalletAdapter,
    WalletError,
    WalletNotConnectedError,
    WalletNotReadyError,
    WalletReadyState,
} from '@solana/wallet-adapter-base';
import type {Connection, PublicKey, Transaction, TransactionSignature} from '@solana/web3.js';
import {useLocalStorage} from '@vueuse/core';

let walletStore: WalletStore | null = null;

// ----------------------------------------------------------------------------
// VUE PLUGIN -----------------------------------------------------------------
// ----------------------------------------------------------------------------
export const SolanaWalletVuePlugin = {
    install: (app: App, options: WalletStoreProps = {}) => {
        walletStore = new WalletStore(options);
        app.config.globalProperties.$wallet = useWallet();
    },
};

// ----------------------------------------------------------------------------
// USE WALLET -----------------------------------------------------------------
// ----------------------------------------------------------------------------
export const useWallet = (): WalletStore => {
    if (walletStore) {
        return walletStore;
    }
    throw new WalletNotInitializedError(
        'Wallet not initialized. Please use the `initWallet` method to initialize the wallet.');
};

// ----------------------------------------------------------------------------
// WALLET STORE ---------------------------------------------------------------
// ----------------------------------------------------------------------------
export type Wallet = Adapter;

export interface WalletStoreProps {
    wallets?: Wallet[] | Ref<Wallet[]>;
    autoConnect?: boolean | Ref<boolean>;
    onError?: (error: WalletError) => void;
    localStorageKey?: string;
}

export class WalletStore {
    // Props.
    wallets: Ref<Wallet[]>;
    autoConnect: Ref<boolean>;
    storage: Ref<string | null>;

    // Data.
    wallet: Ref<Wallet | null>;
    publicKey: ComputedRef<PublicKey | null>;
    readyState: Ref<WalletReadyState>;
    ready: Ref<boolean>;
    connected: Ref<boolean>;
    connecting: Ref<boolean>;
    disconnecting: Ref<boolean>;
    disconnected: Ref<boolean>;

    // Private data.
    onError: (error: WalletError) => void;

    // Methods.
    signTransaction: ComputedRef<SignerWalletAdapter['signTransaction'] | undefined>;
    signAllTransactions: ComputedRef<SignerWalletAdapter['signAllTransactions'] | undefined>;
    signMessage: ComputedRef<MessageSignerWalletAdapter['signMessage'] | undefined>;

    // CONSTRUCTORS -----------------------------------------------------------
    constructor(props: WalletStoreProps) {
        // Props.
        this.wallets = shallowRef(props.wallets || []);
        this.autoConnect = ref(props.autoConnect || false);
        this.storage = useLocalStorage(props.localStorageKey || 'selectedWallet', null);

        // Data.
        this.wallet = shallowRef<Wallet | null>(null);
        this.publicKey = computed(() => this.wallet.value?.publicKey || null);
        this.readyState = ref<WalletReadyState>(WalletReadyState.NotDetected);
        this.ready = computed(() => this.readyState.value === WalletReadyState.Installed || this.readyState.value ===
            WalletReadyState.Loadable);
        this.connected = ref<boolean>(false);
        this.connecting = ref<boolean>(false);
        this.disconnecting = ref<boolean>(false);
        this.disconnected = ref<boolean>(true);

        // Private data.
        this.onError = props.onError || ((error: WalletError) => console.error(error));

        // Methods.
        this.signTransaction = computed(() => {
            const _wallet = this.wallet.value;
            if (!(_wallet && 'signTransaction' in _wallet)) {
                return;
            }

            return async (transaction) => {
                if (!this.connected.value) {
                    this.throwError(new WalletNotConnectedError());
                }

                return await _wallet.signTransaction(transaction);
            };
        });
        this.signAllTransactions = computed(() => {
            const _wallet = this.wallet.value;
            if (!(_wallet && 'signAllTransactions' in _wallet)) {
                return;
            }

            return async (transactions) => {
                if (!this.connected.value) {
                    this.throwError(new WalletNotConnectedError());
                }

                return await _wallet.signAllTransactions(transactions);
            };
        });
        this.signMessage = computed(() => {
            const _wallet = this.wallet.value;
            if (!(_wallet && 'signMessage' in _wallet)) {
                return;
            }

            return async (message: Uint8Array) => {
                if (!this.connected.value) {
                    this.throwError(new WalletNotConnectedError());
                }

                return await _wallet.signMessage(message);
            };
        });

        // Handle the wallet adapter events.
        const onReadyStateChange = (readyState: WalletReadyState) => this.readyState.value = readyState;
        const onConnect = () => {
            this.disconnected.value = false;
            this.connected.value = true;
        };
        const onDisconnect = () => {
            this.disconnected.value = true;
            this.connected.value = false;
        };

        const invalidateListeners = watchEffect((onInvalidate) => {
            const _wallet = this.wallet.value;
            if (!_wallet) {
                return;
            }

            _wallet.on('readyStateChange', onReadyStateChange);
            _wallet.on('connect', onConnect);
            _wallet.on('disconnect', onDisconnect);
            _wallet.on('error', this.onError);

            onInvalidate(() => {
                _wallet.off('readyStateChange', onReadyStateChange);
                _wallet.off('connect', onConnect);
                _wallet.off('disconnect', onDisconnect);
                _wallet.off('error', this.onError);
            });
        });

        if (typeof window !== 'undefined') {
            // Ensure the wallet listeners are invalidated before refreshing the page.
            // This is because Vue does not unmount components when the page is being refreshed.
            window.addEventListener('unload', invalidateListeners);
        }

        // Handle autoconnect.
        watch(this.autoConnect, (autoConnect) => {
            if (autoConnect) {
                this.storage.value = this.wallet.value?.name ?? null;
            } else {
                this.storage.value = null;
            }
        });

        if (this.autoConnect.value) {
            const walletName = this.storage.value;

            if (walletName == null) {
                return;
            }

            this.select(walletName);
            this.connect().catch(() => {
                // Ignore error.
            });
        }
    }

    // METHODS ----------------------------------------------------------------

    select(walletName: string): void {
        if (walletName === this.wallet.value?.name) {
            return;
        }

        for (const newWallet of this.wallets.value) {
            if (newWallet.name === walletName) {
                setWallet(newWallet, this);
                return;
            }
        }

        setWallet(null, this);
    }

    async connect(): Promise<void> {
        if (!this.disconnected.value) {
            return;
        }

        if (!this.wallet.value) {
            this.throwError(new WalletNotSelectedError());
        }

        if (!this.ready.value) {
            window.open(this.wallet.value.url, '_blank');

            this.throwError(new WalletNotReadyError());
        }

        try {
            this.connecting.value = true;
            await this.wallet.value.connect();

            if (this.autoConnect.value) {
                this.storage.value = this.wallet.value.name;
            }
        } catch (error: any) {
            this.throwError(error);
        } finally {
            this.connecting.value = false;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.connected.value || !this.wallet.value) {
            return;
        }

        try {
            this.disconnecting.value = true;
            await this.wallet.value.disconnect();
            this.storage.value = null;
            setWallet(null, this);
        } finally {
            this.disconnecting.value = false;
        }
    }

    async sendTransaction(transaction: Transaction, connection: Connection,
                          options?: SendTransactionOptions): Promise<TransactionSignature> {
        if (!this.wallet.value) {
            this.throwError(new WalletNotSelectedError());
        }

        if (!this.connected.value) {
            this.throwError(new WalletNotConnectedError());
        }

        return await this.wallet.value.sendTransaction(transaction, connection, options);
    };

    private throwError(error: WalletError): never {
        this.onError(error);
        throw error;
    }
}

function setWallet(newWallet: Wallet | null, self: WalletStore) {
    self.wallet.value = newWallet;
    self.readyState.value = newWallet?.readyState ?? WalletReadyState.NotDetected;
    self.connected.value = newWallet?.connected ?? false;
    self.connecting.value = newWallet?.connecting ?? false;
    self.disconnecting.value = false;
    self.disconnected.value = !(newWallet?.connected ?? false);
}

// ----------------------------------------------------------------------------
// ERRORS ---------------------------------------------------------------------
// ----------------------------------------------------------------------------

export class WalletNotSelectedError extends WalletError {
    name = 'WalletNotSelectedError';
}

export class WalletNotInitializedError extends WalletError {
    name = 'WalletNotSelectedError';
}