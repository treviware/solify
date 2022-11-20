<script lang="ts" setup>
import { computed } from 'vue';
import { useBlockchainStore } from 'stores/blockchain';
import { WalletTokenData } from 'stores/tools/walletList';
import TokenAmountInput from 'components/general/input/TokenAmountInput.vue';
import BN from 'bn.js';

const props = defineProps<{
  account: WalletTokenData & { burn: BN };
}>();
const emit = defineEmits<{
  (event: 'update', value: BN): void;
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
const symbol = computed(() => {
  if (metadata.value) {
    return metadata.value?.data?.symbol ?? 'Unknown token';
  } else {
    return tokenInfo.value?.symbol ?? 'Unknown token';
  }
});
const decimals = computed(() => tokenInfo.value?.decimals ?? 0);
const bpsAmount = computed(() => props.account.account.amount);
const amount = computed(() => Number(props.account.account.amount) / Math.pow(10, decimals.value));

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
        <div class="flex column">
          <div>{{ name }}</div>
          <div class="text-caption">{{ amount }} {{ symbol }}</div>
          <div class="text-caption" v-if="decimals !== 0">= {{ bpsAmount }} BPS</div>
        </div>
        <div>
          <TokenAmountInput :model-value="account.burn"
                            :token="account.account.mint"
                            @update:model-value="emit('update', $event)" />
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>