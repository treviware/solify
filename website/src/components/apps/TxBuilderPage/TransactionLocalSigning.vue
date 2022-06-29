<script lang="ts" setup>
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import {computed, reactive, ref, watch} from 'vue';
import {SignatureInfo, TransactionSigningInfo} from 'src/types/signing';
import {isPubkey} from 'src/types/filters';
import TransactionLocalSignature from 'components/apps/TxBuilderPage/TransactionLocalSignature.vue';
import {useWallet} from 'solana-wallets-vue';
import {useSolanaStore} from 'stores/solana';
import {PublicKey, Transaction} from '@solana/web3.js';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import WalletButton from 'components/MainLayout/WalletButton.vue';
import {useQuasar} from 'quasar';
import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';
import SignatureBadge from 'components/general/SignatureBadge.vue';

const quasar = useQuasar();
const txBuilderApp = useTxBuilderApp();
const wallet = useWallet();
const solanaStore = useSolanaStore();

// REFS -----------------------------------------------------------------------
const {
    currentGroup,
} = storeToRefs(txBuilderApp);

const parallelSend = ref(false);
const currentTransaction = ref(-1);
const waitingForWallet = ref(false);
const sendingTransaction = ref(false);
const finalTransactions = ref<Transaction[]>([]);
const resultSignatures = ref<{ txIndex: number, signature: string }[]>([]);

// COMPUTED -------------------------------------------------------------------
const transactions = computed(() => currentGroup.value.transactions);
const signatures = computed<SignatureInfo[]>(() => {
    const signatures: Record<string, SignatureInfo> = {};

    for (const tx of transactions.value) {
        for (let i = 0; i < tx.instructions.length; i++) {
            const instruction = tx.instructions[i];
            const data = tx.data[i];

            for (const account of instruction.accounts) {
                if (account.signer) {
                    const field = data[account.id];
                    if (isPubkey(field)) {
                        if (signatures[field.toBase58()]) {
                            continue;
                        }

                        signatures[field.toBase58()] = {
                            type: 'localWallet',
                            pubkey: field,
                        };
                    } else {
                        signatures[field.publicKey.toBase58()] = {
                            type: 'keypair',
                            pubkey: field.publicKey,
                            keypair: field,
                            provided: true,
                        };
                    }
                }
            }
        }

        if (!signatures[tx.payer.toBase58()]) {
            signatures[tx.payer.toBase58()] = {
                type: 'localWallet',
                pubkey: tx.payer,
            };
        }
    }

    return reactive(Object.values(signatures)) as any;
});
const canSign = computed(() => {
    for (const signature of signatures.value) {
        if (signature.type === 'keypair' && !signature.keypair) {
            return false;
        }
    }

    return true;
});
const signingInfo = computed<TransactionSigningInfo>(() => {
    const signingData: TransactionSigningInfo = {
        keypairSignatures: [],
        walletSignatures: [],
    };

    // Split signatures by type.
    for (const signature of signatures.value) {
        if (signature.type === 'keypair') {
            signingData.keypairSignatures.push(signature);
        } else {
            signingData.walletSignatures.push(reactive({
                ...signature,
                done: false,
            }) as any);
        }
    }

    return signingData;
});
const isSigning = computed(() => currentTransaction.value > -1);
const isConnectedPubkeyNecessary = computed(() => {
    if (wallet.publicKey.value === null) {
        return false;
    }

    // Split signatures by type.
    for (const signature of signingInfo.value.walletSignatures) {
        if (signature.pubkey.equals(wallet.publicKey.value)) {
            return !signature.done;
        }
    }

    return false;
});

// METHODS --------------------------------------------------------------------
async function initSigning() {
    resultSignatures.value.splice(0, resultSignatures.value.length);
    finalTransactions.value = transactions.value.map(tx => {
        const finalTx = new Transaction();
        finalTx.add(
            ...tx.instructions.map((ixn: ProgramIxnDefinition<any, any>, i: number) => ixn.build(ixn, tx.data[i])));
        finalTx.feePayer = tx.payer;
        finalTx.recentBlockhash = PublicKey.default.toBase58();

        // To generate signatures.
        finalTx.serializeMessage();

        return finalTx;
    });

    // Clean up.
    signingInfo.value.walletSignatures.forEach(v => v.done = false);
    waitingForWallet.value = false;
    currentTransaction.value = 0;

    if (parallelSend.value) {
        return parallelKeypairSigning();
    } else {
        return serialKeypairSigning();
    }
}

async function serialKeypairSigning() {
    const keypairs = signingInfo.value.keypairSignatures.map(v => v.keypair!);
    const recentBlockhash = (await solanaStore.connection.getLatestBlockhash()).blockhash;
    const tx = finalTransactions.value[currentTransaction.value];
    tx.recentBlockhash = recentBlockhash;

    // Sign with keypairs.
    const keypairsForTx = keypairs.filter(v => tx.signatures.some(v2 => v2.publicKey.equals(v.publicKey)));
    if (keypairsForTx.length > 0) {
        tx.partialSign(...keypairsForTx);
    }

    return serialWalletSigning();
}

async function parallelKeypairSigning() {
    const keypairs = signingInfo.value.keypairSignatures.map(v => v.keypair!);
    const recentBlockhash = (await solanaStore.connection.getLatestBlockhash()).blockhash;

    for (const tx of finalTransactions.value) {
        tx.recentBlockhash = recentBlockhash;

        // Sign with keypairs.
        const keypairsForTx = keypairs.filter(v => tx.signatures.some(v2 => v2.publicKey.equals(v.publicKey)));
        if (keypairsForTx.length > 0) {
            tx.partialSign(...keypairsForTx);
        }
    }

    return parallelWalletSigning();
}

async function serialWalletSigning(): Promise<void> {
    const tx = finalTransactions.value[currentTransaction.value];

    let signaturesDone = signingInfo.value.walletSignatures.length;
    for (const signature of signingInfo.value.walletSignatures) {
        if (signature.done) {
            continue;
        }

        if (!tx.signatures.some(v => v.publicKey.equals(signature.pubkey))) {
            signature.done = true;
            continue;
        }

        if (wallet.publicKey.value && signature.pubkey.equals(wallet.publicKey.value)) {
            try {
                await wallet.signTransaction.value!(tx);
                signature.done = true;
                continue;
            } catch (e) {
                if (currentTransaction.value !== -1) {
                    console.error('error signing with wallet', e);
                    quasar.notify({
                        message: 'Error signing with wallet',
                        color: 'negative',
                    });
                }
            }
        }

        signaturesDone -= 1;
    }

    if (signaturesDone === signingInfo.value.walletSignatures.length) {
        return serialSendTransaction();
    } else {
        waitingForWallet.value = true;
    }
}

async function parallelWalletSigning(): Promise<void> {
    let signaturesDone = signingInfo.value.walletSignatures.length;
    for (const signature of signingInfo.value.walletSignatures) {
        if (signature.done) {
            continue;
        }

        if (wallet.publicKey.value && signature.pubkey.equals(wallet.publicKey.value)) {
            const txList: Transaction[] = [];

            for (const tx of finalTransactions.value) {
                if (tx.signatures.some(v => v.publicKey.equals(signature.pubkey))) {
                    txList.push(tx);
                }
            }

            try {
                await wallet.signAllTransactions.value!(txList);
                signature.done = true;
                continue;
            } catch (e) {
                if (currentTransaction.value !== -1) {
                    console.error('error signing with wallet', e);
                    quasar.notify({
                        message: 'Error signing with wallet',
                        color: 'negative',
                    });
                }
            }
        }

        signaturesDone -= 1;
    }

    if (signaturesDone === signingInfo.value.walletSignatures.length) {
        return parallelSendTransaction();
    } else {
        waitingForWallet.value = true;
    }
}

async function serialSendTransaction() {
    waitingForWallet.value = false;
    sendingTransaction.value = true;

    // Send tx.
    const txDef = transactions.value[currentTransaction.value];
    const tx = finalTransactions.value[currentTransaction.value];
    try {
        const signature = await solanaStore.connection.sendRawTransaction(tx.serialize());
        resultSignatures.value.push({
            txIndex: currentTransaction.value,
            signature,
        });
        quasar.notify({
            message: `${txDef.name} sent`,
            color: 'positive',
            badgeColor: 'positive',
        });
    } catch (e) {
        console.error(`error sending transaction: ${txDef.name}`, e);
        quasar.notify({
            message: `Cannot send ${txDef.name}: ${e}`,
            color: 'negative',
            classes: 'persistent-notification-error',
            closeBtn: true,
            timeout: 0,
        });
        currentTransaction.value = -1;
        return;
    }

    // Clean up.
    signingInfo.value.walletSignatures.forEach(v => v.done = false);
    sendingTransaction.value = false;

    currentTransaction.value += 1;
    if (currentTransaction.value >= finalTransactions.value.length) {
        currentTransaction.value = -1;
        return;
    }

    return serialKeypairSigning();
}

async function parallelSendTransaction() {
    waitingForWallet.value = false;
    sendingTransaction.value = true;

    // Send txs.
    const promises = [];
    for (let i = 0; i < finalTransactions.value.length; i++) {
        const txDef = transactions.value[i];
        const tx = finalTransactions.value[i];

        promises.push(solanaStore.connection.sendRawTransaction(tx.serialize()).then(signature => {
            resultSignatures.value.push({
                txIndex: i,
                signature,
            });
            quasar.notify({
                message: `${txDef.name} sent`,
                color: 'positive',
                badgeColor: 'positive',
            });
        }).catch(e => {
            console.error(`error sending transaction: ${txDef.name}`, e);
            quasar.notify({
                message: `Cannot send ${txDef.name}: ${e}`,
                color: 'negative',
                classes: 'persistent-notification-error',
                closeBtn: true,
                timeout: 0,
            });
        }));
    }

    await Promise.all(promises);

    // Clean up.
    sendingTransaction.value = false;
    currentTransaction.value = -1;
}

function retrySigning() {
    if (parallelSend.value) {
        parallelWalletSigning();
    } else {
        serialWalletSigning();
    }
}

function cancelSigning() {
    currentTransaction.value = -1;
}

// WATCHES --------------------------------------------------------------------
watch(wallet.publicKey, (publicKey) => {
    if (publicKey && waitingForWallet.value) {
        retrySigning();
    }
});

// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-card class="full-width">
        <q-bar>
            <div>Signing {{ currentGroup.name }}</div>
            <q-space/>
            <q-btn dense flat icon="fa-solid fa-xmark" v-close-popup>
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
        </q-bar>

        <template v-if="transactions.length > 1">
            <q-card-section class="row flex-center q-mx-md" v-if="!isSigning">
                <div>Serial send</div>
                <q-toggle v-model="parallelSend"/>
                <div>Parallel send</div>
            </q-card-section>

            <q-card-section class="row flex-center q-mx-md" v-else-if="!parallelSend">
                <div>Signing: {{ transactions[currentTransaction].name }}</div>
            </q-card-section>
        </template>

        <template v-if="!isSigning">
            <q-card-section>
                <p>To sign the transaction group you must provide the following signatures. Please pick how you would
                    want
                    to provide them, either pasting their keypairs or by using a multi-wallet signature.</p>
                <q-list dense separator>
                    <TransactionLocalSignature v-for="sig in signatures" :key="sig.pubkey.toBase58()" :signature="sig"/>
                </q-list>
            </q-card-section>

            <q-card-actions class="flex flex-center">
                <q-btn @click="initSigning" color="primary" unelevated no-caps :disable="!canSign">Sign</q-btn>
            </q-card-actions>
        </template>
        <template v-else>
            <q-card-section>
                <p>Please connect the wallets one by one to sign the transaction. It will be sent automatically when all
                    signatures are present.</p>
                <q-list dense separator>
                    <q-item v-for="sig in signingInfo.keypairSignatures" :key="sig.pubkey.toBase58()">
                        <q-item-section class="q-py-sm">
                            <q-item-label class="row gap-x-md justify-between">
                                <PubkeyBadge long :pubkey="sig.pubkey"/>
                                <q-icon color="primary" name="fa-solid fa-circle-check"/>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item v-for="sig in signingInfo.walletSignatures" :key="sig.pubkey.toBase58()">
                        <q-item-section class="q-py-sm">
                            <q-item-label class="row gap-x-md justify-between">
                                <PubkeyBadge long :pubkey="sig.pubkey"/>
                                <q-icon color="primary" name="fa-solid fa-circle-check" v-if="sig.done"/>
                                <q-icon name="fa-regular fa-circle" v-else/>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <q-card-actions class="flex flex-center gap-md">
                <WalletButton v-if="waitingForWallet"/>
                <q-btn @click="retrySigning"
                       color="primary"
                       unelevated
                       no-caps
                       v-if="waitingForWallet && isConnectedPubkeyNecessary">Retry
                </q-btn>
                <q-btn @click="cancelSigning" color="negative" unelevated no-caps v-if="!sendingTransaction">Cancel
                </q-btn>
                <div v-else>
                    Sending...
                    <q-spinner/>
                </div>
            </q-card-actions>
        </template>

        <template v-if="resultSignatures.length > 0">
            <q-separator/>
            <q-card-section>
                <q-list dense separator>
                    <q-item v-for="sig in resultSignatures" :key="sig.signature">
                        <q-item-section>
                            <q-item-label style="word-break: break-all;"><u><b>{{ transactions[sig.txIndex].name }}</b></u>:
                                <span class="text-caption text-bold"><SignatureBadge long
                                                                                     show-copy
                                                                                     show-menu
                                                                                     :signature="sig.signature"/></span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </template>
    </q-card>
</template>

<style lang="scss">
.persistent-notification-error .q-btn__content {
    color: white;
}
</style>