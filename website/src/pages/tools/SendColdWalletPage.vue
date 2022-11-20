<script lang="ts" setup>
import { ref, watch } from 'vue';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import { processUriStoreDataOnMounted, writeToolParamsIntoUri } from 'src/utils/tools';
import { useQuasar } from 'quasar';
import { useSolanaStore } from 'stores/solana';
import { useWallet } from 'src/lib/WalletAdapter';
import { useSendColdWalletToolStore } from 'stores/tools/sendColdWallet';
import { storeToRefs } from 'pinia';
import { loadWalletTokens } from 'src/utils/solana';
import {
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress
} from '@solana/spl-token';
import AlertBox from 'components/general/AlertBox.vue';

const quasar = useQuasar();
const wallet = useWallet();
const solanaStore = useSolanaStore();
const sendColdWalletToolStore = useSendColdWalletToolStore();

// REFS -----------------------------------------------------------------------
const loading = ref(false);
const showDialog = ref(false);
const {
  origin,
  destination
} = storeToRefs(sendColdWalletToolStore);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
async function sendTokens() {
  loading.value = true;

  try {
    // Load token accounts.
    let tokens = await loadWalletTokens(solanaStore.connection, origin.value!);

    if (tokens.length > 0) {
      // Create txs.
      let transactions = [new Transaction()];
      transactions[0].feePayer = origin.value!;
      transactions[0].recentBlockhash = PublicKey.default.toBase58();

      for (let t of tokens) {
        let transaction = transactions[transactions.length - 1];

        if (Number(t.amount) !== 0) {
          let destinationTokenAddress = await getAssociatedTokenAddress(t.mint, destination.value!);
          transaction.add(
            createAssociatedTokenAccountInstruction(origin.value!, destinationTokenAddress, destination.value!,
              t.mint));
          transaction.add(createTransferInstruction(t.address, destinationTokenAddress, origin.value!, t.amount));
        }

        transaction.add(createCloseAccountInstruction(t.address, destination.value!, origin.value!));

        let serializedTx = transaction.serializeMessage();

        if (serializedTx.length >= 1050) {
          let newTransaction = new Transaction();
          newTransaction.feePayer = origin.value!;
          newTransaction.recentBlockhash = PublicKey.default.toBase58();

          transactions.push(newTransaction);
        }
      }

      const recentBlockhash = (await solanaStore.connection.getLatestBlockhash()).blockhash;
      transactions.forEach(t => t.recentBlockhash = recentBlockhash);

      let txs = await wallet.signAllTransactions.value!(transactions);

      let txIds = await Promise.all(txs.map(async tx => {
        let txId = await solanaStore.connection.sendRawTransaction(tx.serialize());
        await solanaStore.connection.confirmTransaction(txId, 'confirmed');

        return txId;
      }));
      console.log('Sent transactions', txIds);

      quasar.notify({
        message: 'SPL tokens sent!',
        color: 'positive'
      });
    }
  } catch (e) {
    console.error('Error sending SPL tokens and closing accounts', e);
    quasar.notify({
      message: 'Error sending SPL tokens and closing accounts',
      color: 'negative'
    });

    loading.value = false;
    return;
  }

  try {
    // Get balance.
    let balance = await solanaStore.connection.getBalance(origin.value!);

    // Create tx.
    let transaction = new Transaction();
    transaction.add(SystemProgram.transfer({
      fromPubkey: origin.value!,
      toPubkey: destination.value!,
      lamports: balance - 5000
    }));
    transaction.feePayer = origin.value!;
    transaction.recentBlockhash = (await solanaStore.connection.getLatestBlockhash()).blockhash;

    let tx = await wallet.signTransaction.value!(transaction);
    let txid = await solanaStore.connection.sendRawTransaction(tx.serialize());
    console.log('Sent transaction', txid);

    quasar.notify({
      message: 'SOL balance send!',
      color: 'positive'
    });
  } catch (e) {
    console.error('Error sending SOL balance', e);
    quasar.notify({
      message: 'Error sending SOL balance',
      color: 'negative'
    });

  }

  loading.value = false;
}

function writeToUri() {
  return writeToolParamsIntoUri({
    origin: origin.value ?? undefined,
    destination: destination.value ?? undefined
  });
}

// WATCHES --------------------------------------------------------------------
watch([origin, destination], () => {
  writeToUri();
});

// HOOKS ----------------------------------------------------------------------
processUriStoreDataOnMounted(async (query) => {
  const originQuery = query.origin;
  if (originQuery) {
    try {
      origin.value = new PublicKey(originQuery);
    } catch (e) {
    }
  }

  const destinationQuery = query.destination;
  if (destinationQuery) {
    try {
      destination.value = new PublicKey(destinationQuery);
    } catch (e) {
    }
  }

  writeToUri();
});
</script>

<template>
  <div class="q-px-lg q-py-md">
    <div class="text-secondary text-caption text-bold q-mt-md">Origin wallet</div>
    <PubkeyInput v-model="origin" dense show-wallet-button />
    <div class="text-secondary text-caption text-bold q-mt-md">Destination wallet</div>
    <PubkeyInput v-model="destination" dense show-wallet-button />
    <div class="flex flex-center q-mt-md">
      <q-btn dense
             color="secondary"
             text-color="black"
             unelevated
             no-caps
             :loading="loading"
             :disable="!origin || !destination || origin?.equals(destination)"
             size="md"
             class="q-px-sm q-py-none"
             @click="showDialog = true">
        Send everything
      </q-btn>
    </div>
    <AlertBox type="info" class="q-mt-md">The process is done in two transactions: first SPL tokens are sent and their
      accounts closed in one or more transactions, on the other hand the second transaction moves the final SOL amount.
    </AlertBox>
    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section>Confirm you want to move everything to the cold wallet:</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="white" v-close-popup />
          <q-btn flat label="Confirm" color="primary" v-close-popup @click="sendTokens" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped></style>