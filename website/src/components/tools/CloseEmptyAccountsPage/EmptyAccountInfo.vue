<script lang="ts" setup>
import { computed } from 'vue';
import { useBlockchainStore } from 'stores/blockchain';
import { WalletTokenData } from 'stores/tools/walletList';
import { PublicKey } from '@solana/web3.js';

const props = defineProps<{
  account: WalletTokenData; selectedAccounts: PublicKey[];
}>();
const emit = defineEmits<{
  (event: 'select'): void;
}>();

const blockchainStore = useBlockchainStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const tokenInfo = computed(() => blockchainStore.getTokenMetadata(props.account.account.mint) ?? null);
const metadata = computed(() => props.account.metadata);
const name = computed(() => {
  if (metadata.value) {
    return metadata.value?.data?.name ?? 'Unknown token';
  } else {
    return tokenInfo.value?.name ?? 'Unknown token';
  }
});
const selected = computed(
  () => props.selectedAccounts.find((a) => a.equals(props.account.account.address)) !== undefined);

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
  <q-item>
    <q-item-section avatar>
      <q-avatar square>
        <img :src="(metadata ? metadata?.external?.image : tokenInfo?.logoURI) ?? '/placeholder.jpg'">
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="row justify-between">
        <div class="flex flex-center">
          {{ name }}
        </div>
        <div>
          <q-checkbox :model-value="selected" @update:model-value="emit('select')" />
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>