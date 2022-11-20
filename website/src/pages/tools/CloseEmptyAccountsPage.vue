<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { PublicKey, Transaction } from '@solana/web3.js';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import { useCloseEmptyAccountsToolStore } from 'stores/tools/closeEmptyAccounts';
import { processUriStoreDataOnMounted, writeToolParamsIntoUri } from 'src/utils/tools';
import { deriveMetadataAccountKey, loadMetadataAccounts, loadWalletTokens } from 'src/utils/solana';
import { useBlockchainStore } from 'stores/blockchain';
import { useQuasar } from 'quasar';
import { useSolanaStore } from 'stores/solana';
import { WalletTokenData } from 'stores/tools/walletList';
import axios, { AxiosResponse } from 'axios';
import EmptyAccountInfo from 'components/tools/CloseEmptyAccountsPage/EmptyAccountInfo.vue';
import { useWallet } from 'src/lib/WalletAdapter';
import { createCloseAccountInstruction } from '@solana/spl-token';

const quasar = useQuasar();
const wallet = useWallet();
const solanaStore = useSolanaStore();
const closeEmptyAccountsToolStore = useCloseEmptyAccountsToolStore();
const blockchainStore = useBlockchainStore();

// REFS -----------------------------------------------------------------------
const loading = ref(false);
const newWallet = ref(closeEmptyAccountsToolStore.wallet ?? '');
const accounts = ref<WalletTokenData[]>([]);
const selectedAccounts = ref<PublicKey[]>([]);
const loaded = ref(false);

// COMPUTED -------------------------------------------------------------------
const newWalletAsPubkey = computed(() => {
  try {
    return new PublicKey(newWallet.value);
  } catch (e) {
    return null;
  }
});
const selectedWallet = computed(() => closeEmptyAccountsToolStore.wallet);

// METHODS --------------------------------------------------------------------
async function loadData() {
  loading.value = true;

  closeEmptyAccountsToolStore.wallet = newWalletAsPubkey.value;

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

      let mappedAccounts: WalletTokenData[] = response.filter(v => Number(v.amount) === 0).map(v => ({
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

      accounts.value = mappedAccounts;
      selectedAccounts.value = mappedAccounts.map(v => v.account.address);
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

async function closeAccounts() {
  loading.value = true;

  try {
    let transaction = new Transaction();

    for (let i of selectedAccounts.value) {
      transaction.add(createCloseAccountInstruction(i, selectedWallet.value!, selectedWallet.value!));
    }

    transaction.recentBlockhash = (await solanaStore.connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = selectedWallet.value!;

    let tx = await wallet.signTransaction.value!(transaction);
    let txid = await solanaStore.connection.sendRawTransaction(tx.serialize());
    console.log('Sent transaction', txid);

    accounts.value = accounts.value.filter(v => !selectedAccounts.value.includes(v.account.address));
    selectedAccounts.value.splice(0, selectedAccounts.value.length);

    quasar.notify({
      message: 'Accounts closed!',
      color: 'positive'
    });
  } catch (e) {
    console.error('Error closing accounts', e);
    quasar.notify({
      message: 'Error closing accounts',
      color: 'negative'
    });
  }

  loading.value = false;
}

function writeToUri() {
  return writeToolParamsIntoUri({
    wallet: selectedWallet.value ?? undefined
  });
}

function select(account: WalletTokenData) {
  let position = selectedAccounts.value.indexOf(account.account.address);
  if (position === -1) {
    selectedAccounts.value.push(account.account.address);
  } else {
    selectedAccounts.value.splice(position, 1);
  }
}

// WATCHES --------------------------------------------------------------------
watch(selectedWallet, () => {
  writeToUri();
});

// HOOKS ----------------------------------------------------------------------
processUriStoreDataOnMounted(async (query) => {
  const queryWallet = query.wallet;
  if (queryWallet) {
    try {
      closeEmptyAccountsToolStore.wallet = new PublicKey(queryWallet);
    } catch (e) {
    }
  }

  writeToUri();
});
</script>

<template>
  <div class="q-px-lg q-py-md">
    <p>Select the wallet whose accounts you want to close, then click the load button to load the token accounts from
      Solana.</p>
    <PubkeyInput v-model="newWallet" dense show-wallet-button />
    <div class="relative-position">
      <q-separator class="q-my-lg" />
      <q-btn dense
             color="secondary"
             text-color="black"
             unelevated
             no-caps
             :loading="loading"
             :disable="!newWalletAsPubkey"
             size="md"
             class="q-px-sm q-py-none absolute-center"
             @click="loadData">
        Load accounts
      </q-btn>
    </div>
    <template v-if="loaded">
      <template v-if="accounts.length === 0">
        <p class="text-center">No empty accounts found.</p>
      </template>
      <template v-else>
        <p>Select the accounts to close:</p>
        <EmptyAccountInfo v-for="account in accounts"
                          :account="account"
                          :key="account.account.address.toBase58()"
                          :selected-accounts="selectedAccounts"
                          @select="select(account)" />
        <div class="flex flex-center">
          <q-btn dense
                 color="secondary"
                 text-color="black"
                 unelevated
                 no-caps
                 :loading="loading"
                 :disable="selectedAccounts.length === 0"
                 size="md"
                 class="q-px-sm q-py-none"
                 @click="closeAccounts">
            Close accounts
          </q-btn>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>