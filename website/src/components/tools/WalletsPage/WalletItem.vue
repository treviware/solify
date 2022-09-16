<script lang="ts" setup>

import {useWalletListStore, WalletTokenData} from 'stores/tools/walletList';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import {useWallet} from 'src/lib/WalletAdapter';
import {PublicKey} from '@solana/web3.js';
import {computed, ref} from 'vue';
import {useQuasar} from 'quasar';
import {useSolanaStore} from 'stores/solana';
import {deriveMetadataAccountKey, loadMetadataAccounts, loadWalletTokens} from 'src/utils/solana';
import WalletTokenItem from 'components/tools/WalletsPage/WalletTokenItem.vue';
import {useBlockchainStore} from 'stores/blockchain';
import axios, {AxiosResponse} from 'axios';

const props = defineProps<{
    address: PublicKey;
}>();

const quasar = useQuasar();
const wallet = useWallet();
const walletListStore = useWalletListStore();
const solanaStore = useSolanaStore();
const blockchainStore = useBlockchainStore();

// REFS -----------------------------------------------------------------------
const loading = ref(false);

// COMPUTED -------------------------------------------------------------------
const walletData = computed(() => walletListStore.wallets.find(v => v.address.equals(props.address))!);
const isConnected = computed(() => walletData.value.address.equals(wallet.publicKey.value ?? PublicKey.default));
const index = computed(() => walletListStore.wallets.findIndex(v => v.address.equals(walletData.value.address)));
const isStart = computed(() => index.value === 0);
const isEnd = computed(() => index.value === walletListStore.wallets.length - 1);
const isEmpty = computed(() => walletData.value.tokens.length === 0 && !walletData.value.isLoaded);
const solAmount = computed(() => walletData.value.amount / Math.pow(10, blockchainStore.solToken.decimals));
const tokens = computed(
    () => walletData.value.tokens.filter(v => blockchainStore.getTokenMetadata(v.account.mint)?.name).sort((a, b) => {
        const nameA = blockchainStore.getTokenMetadata(a.account.mint).name;
        const nameB = blockchainStore.getTokenMetadata(b.account.mint).name;

        const result = nameA.localeCompare(nameB);

        if (result !== 0) {
            return result;
        }

        return a.account.mint.toString().localeCompare(b.account.mint.toString());
    }));
const nfts = computed(
    () => walletData.value.tokens.filter(v => !blockchainStore.getTokenMetadata(v.account.mint)?.name).sort((a, b) => {
        const nameA = a.metadata?.data?.name ?? 'Unknown token';
        const nameB = b.metadata?.data?.name ?? 'Unknown token';

        const result = nameA.localeCompare(nameB);

        if (result !== 0) {
            return result;
        }

        return a.account.mint.toString().localeCompare(b.account.mint.toString());
    }));

// METHODS --------------------------------------------------------------------
function validateWalletName(name: string) {
    return name.length > 0 && name.length <= 20 && !walletListStore.wallets.some(v => v.name === name);
}

function remove() {
    walletListStore.wallets.splice(index.value, 1);
}

function moveUp() {
    const i = index.value;
    walletListStore.wallets.splice(i - 1, 0, walletData.value);
    walletListStore.wallets.splice(i + 1, 1);
}

function moveDown() {
    const i = index.value;
    walletListStore.wallets.splice(i + 2, 0, walletData.value);
    walletListStore.wallets.splice(i, 1);
}

async function loadData() {
    loading.value = true;

    try {
        // Load tokens to filter those that are normal tokens.
        try {
            await blockchainStore.loadTokenList();
        } catch (e) {
            console.error('Error loading SPL tokens', e);
            quasar.notify({
                message: 'Cannot load SPL tokens',
                color: 'negative',
            });
            return;
        }

        try {
            walletData.value.amount = await solanaStore.connection.getBalance(walletData.value.address);
        } catch (e) {
            console.error('Error loading wallet balance', e);
            quasar.notify({
                message: 'Cannot load wallet balance',
                color: 'negative',
            });
            return;
        }

        try {
            let accounts = await loadWalletTokens(solanaStore.connection, walletData.value.address);

            if (accounts.length === 0) {
                walletData.value.isLoaded = true;
                return;
            }

            let mappedAccounts: WalletTokenData[] = accounts.map(v => ({
                account: v,
            }));

            const filteredMappedAccounts = mappedAccounts.filter(
                v => blockchainStore.getTokenMetadata(v.account.mint) === null);
            const metaAccountKeys = await Promise.all(
                filteredMappedAccounts.map(v => deriveMetadataAccountKey(v.account.mint)));
            const metaAccounts = await loadMetadataAccounts(solanaStore.connection, metaAccountKeys);

            const loadedDataPromises: Promise<AxiosResponse | null>[] = [];
            for (let i = 0; i < filteredMappedAccounts.length; i++) {
                const metaAccount = metaAccounts[i];

                if (metaAccount != null) {
                    const account = filteredMappedAccounts[i];
                    account.metadata = metaAccount;
                    loadedDataPromises.push((async () => {
                        try {
                            return await axios.get(metaAccount.data.uri);
                        } catch (_) {
                            return null;
                        }
                    })());
                }
            }

            const loadedData = await Promise.all(loadedDataPromises);
            for (let i = 0; i < filteredMappedAccounts.length; i++) {
                const account = filteredMappedAccounts[i];
                const data = loadedData[i];

                if (account.metadata && data) {
                    account.metadata.external = data.data;
                }
            }

            walletData.value.isLoaded = true;
            walletData.value.tokens.splice(0, walletData.value.tokens.length, ...mappedAccounts);
        } catch (e) {
            console.error('Error loading wallet data', e);
            quasar.notify({
                message: 'Cannot load wallet data',
                color: 'negative',
            });
            return;
        }

        walletData.value.listOpen = true;
    } finally {
        loading.value = false;
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-expansion-item expand-icon-toggle expand-separator expand-icon="fa-solid fa-caret-down">
        <template v-slot:header>
            <q-item-section>
                <q-item-label class="text-bold">
                    <span class="q-mr-xs">{{ walletData.name }}
                        <q-popup-edit v-model="walletData.name" v-slot="scope" auto-save :validate="validateWalletName">
                            <q-input v-model="scope.value" autofocus outlined dense class="col"/>
                        </q-popup-edit>
                    </span>
                    <PubkeyBadge :pubkey="walletData.address" show-copy class="badge-color" show-menu/>
                </q-item-label>
            </q-item-section>
            <q-item-section side>
                <div>
                    <q-badge v-if="isConnected"
                             color="secondary"
                             text-color="dark"
                             class="text-bold q-mr-sm"
                             label="Connected"/>
                    <q-badge v-if="walletData.keypair !== null"
                             color="accent"
                             text-color="dark"
                             class="text-bold q-mr-sm"
                             label="Signer"/>
                    <q-btn color="white" flat dense @click="loadData" round class="rounded-borders" :loading="loading">
                        <q-icon name="fa-solid fa-cloud-arrow-down" size="20px"/>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Load wallet info
                        </q-tooltip>
                    </q-btn>
                    <q-btn color="white" flat dense @click="moveUp" round class="rounded-borders" :disable="isStart">
                        <q-icon name="fa-solid fa-angles-up" size="20px"/>
                    </q-btn>
                    <q-btn color="white" flat dense @click="moveDown" round class="rounded-borders" :disable="isEnd">
                        <q-icon name="fa-solid fa-angles-down" size="20px"/>
                    </q-btn>
                    <q-btn color="negative"
                           flat
                           dense
                           @click="remove"
                           round
                           class="rounded-borders"
                           :disable="isConnected">
                        <q-icon name="fa-solid fa-trash" size="20px"/>
                    </q-btn>
                </div>
            </q-item-section>
        </template>
        <q-card>
            <q-card-section v-if="isEmpty" class="flex flex-center">
                <q-btn color="primary" unelevated @click="loadData" no-caps :loading="loading">Load wallet info
                </q-btn>
            </q-card-section>
            <q-card-section v-else>
                <q-list separator>
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar square>
                                <img :src="blockchainStore.solToken.logoURI">
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="row justify-between">
                                <div>Solana</div>
                                <div class="text-caption">
                                    {{ solAmount }} {{ blockchainStore.solToken.symbol }}
                                </div>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                    <WalletTokenItem v-for="token in tokens"
                                     :key="token.account.address"
                                     :address="token.account.address"
                                     :wallet-data="walletData"/>
                    <WalletTokenItem v-for="token in nfts"
                                     :key="token.account.address"
                                     :address="token.account.address"
                                     :wallet-data="walletData"/>
                </q-list>
            </q-card-section>
        </q-card>
    </q-expansion-item>
</template>

<style lang="scss" scoped>
.badge-color {
  background-color: transparentize(#ffffff, 0.8);
  color: #ffffff !important;
}
</style>