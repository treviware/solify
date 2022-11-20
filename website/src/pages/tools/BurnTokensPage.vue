<script lang="ts" setup>
import { ref, watch } from 'vue';
import { PublicKey, Transaction } from '@solana/web3.js';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import { processUriStoreDataOnMounted, writeToolParamsIntoUri } from 'src/utils/tools';
import { useQuasar } from 'quasar';
import { useSolanaStore } from 'stores/solana';
import { storeToRefs } from 'pinia';
import { useBurnTokensToolStore } from 'stores/tools/burnTokens';
import { WalletTokenData } from 'stores/tools/walletList';
import { deriveMetadataAccountKey, loadMetadataAccounts, loadWalletTokens } from 'src/utils/solana';
import axios, { AxiosResponse } from 'axios';
import { useBlockchainStore } from 'stores/blockchain';
import AccountInfo from 'components/tools/BurnTokensPage/AccountInfo.vue';
import BN from 'bn.js';
import { createBurnInstruction, createCloseAccountInstruction } from '@solana/spl-token';
import { useWallet } from 'src/lib/WalletAdapter';

const quasar = useQuasar();
const walletStore = useWallet();
const solanaStore = useSolanaStore();
const blockchainStore = useBlockchainStore();
const burnTokensToolStore = useBurnTokensToolStore();

// REFS -----------------------------------------------------------------------
const loading = ref(false);
const loaded = ref(false);
const selectedWallet = ref<PublicKey | null>(null);
const accounts = ref<(WalletTokenData & { burn: BN })[]>([]);
const {
  wallet
} = storeToRefs(burnTokensToolStore);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
async function loadData() {
  loading.value = true;

  selectedWallet.value = wallet.value;
  accounts.value.splice(0, accounts.value.length);

  try {
    // Load tokens to filter those that are normal tokens.
    try {
      await blockchainStore.loadTokenList();
    } catch (e) {
      console.error('Error loading SPL tokens', e);
      quasar.notify({
        message: 'Cannot load SPL tokens',
        color: 'negative'
      });
      return;
    }

    try {
      let response = await loadWalletTokens(solanaStore.connection, selectedWallet.value!);

      if (response.length === 0) {
        loaded.value = true;
        return;
      }

      let mappedAccounts: WalletTokenData[] = response.map(v => ({
        account: v
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

      accounts.value = mappedAccounts.map(v => ({
        ...v,
        burn: new BN(0)
      }));
      loaded.value = true;
    } catch (e) {
      console.error('Error loading wallet data', e);
      quasar.notify({
        message: 'Cannot load wallet data',
        color: 'negative'
      });
      return;
    }
  } finally {
    loading.value = false;
  }
}

async function burnTokens() {
  loading.value = true;

  try {
    // Load token accounts.
    let tokens = accounts.value.filter(v => v.burn.gt(new BN(0)));

    if (tokens.length > 0) {
      // Create txs.
      let transaction = new Transaction();
      transaction.feePayer = wallet.value!;

      for (let t of tokens) {
        transaction.add(createBurnInstruction(t.account.address, t.account.mint, wallet.value!, t.burn.toNumber()));

        let amount = new BN(t.account.amount.toString());
        if (t.burn.eq(amount)) {
          transaction.add(createCloseAccountInstruction(t.account.address, wallet.value!, wallet.value!));
        }
      }

      transaction.recentBlockhash = (await solanaStore.connection.getLatestBlockhash()).blockhash;

      let tx = await walletStore.signTransaction.value!(transaction);
      let txId = await solanaStore.connection.sendRawTransaction(tx.serialize());
      console.log('Sent transaction', txId);

      quasar.notify({
        message: 'Tokens burned!',
        color: 'positive'
      });

      loadData();
    }
  } catch (e) {
    console.error('Error burning tokens', e);
    quasar.notify({
      message: 'Error burning tokens',
      color: 'negative'
    });
  }

  loading.value = false;
}

function writeToUri() {
  return writeToolParamsIntoUri({
    wallet: wallet.value ?? undefined
  });
}

function updateBurnAmount(account: WalletTokenData & { burn: BN }, amount: BN) {
  let max = new BN(account.account.amount.toString());
  if (amount.lte(max)) {
    account.burn = amount;
  } else {
    account.burn = max;
  }
}

// WATCHES --------------------------------------------------------------------
watch(wallet, () => {
  writeToUri();
});

// HOOKS ----------------------------------------------------------------------
processUriStoreDataOnMounted(async (query) => {
  const walletQuery = query.wallet;
  if (walletQuery) {
    try {
      wallet.value = new PublicKey(walletQuery);
    } catch (e) {
    }
  }

  writeToUri();
});
</script>

<template>
  <div class="q-px-lg q-py-md">
    <div class="text-secondary text-caption text-bold q-mt-md">Wallet</div>
    <PubkeyInput v-model="wallet" dense show-wallet-button />
    <div class="relative-position">
      <q-separator class="q-my-lg" />
      <q-btn dense
             color="secondary"
             text-color="black"
             unelevated
             no-caps
             :loading="loading"
             :disable="!wallet"
             size="md"
             class="q-px-sm q-py-none absolute-center"
             @click="loadData">
        Load token accounts
      </q-btn>
    </div>
    <template v-if="loaded">
      <template v-if="accounts.length === 0">
        <p class="text-center">No empty accounts found.</p>
      </template>
      <template v-else>
        <p>Select the accounts to close:</p>
        <AccountInfo v-for="account in accounts"
                     :account="account"
                     :key="account.account.address.toBase58()"
                     @update="updateBurnAmount(account, $event)" />
        <div class="flex flex-center">
          <q-btn dense
                 color="secondary"
                 text-color="black"
                 unelevated
                 no-caps
                 :loading="loading"
                 size="md"
                 class="q-px-sm q-py-none"
                 @click="burnTokens">
            Burn tokens
          </q-btn>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>