<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useTokenPriceToolStore} from 'stores/pages/tools/tokenPrice';
import AlertBox from 'components/general/AlertBox.vue';
import SplTokenInput from 'components/general/input/SplTokenInput.vue';
import {computed, onMounted} from 'vue';
import {TokenMeta, useBlockchainStore} from 'stores/blockchain';
import {useCoingeckoStore} from 'stores/coingecko';
import VsCurrencyText from 'components/general/VsCurrencyText.vue';
import {PublicKey} from '@solana/web3.js';
import {formatBasisPoints, formatRealValue} from 'src/utils/tokens';
import TokenAmountInput from 'components/general/input/TokenAmountInput.vue';

const tokenPriceToolStore = useTokenPriceToolStore();
const blockchainStore = useBlockchainStore();
const coingeckoStore = useCoingeckoStore();

// REFS -----------------------------------------------------------------------
const {
    amount,
    token,
    comparingToken,
} = storeToRefs(tokenPriceToolStore);

// COMPUTED -------------------------------------------------------------------
const isComparing = computed(() => comparingToken.value !== null);
const tokenMeta = computed(() => blockchainStore.getTokenMetadata(token.value));
const comparingTokenMeta = computed(() => {
    if (comparingToken.value) {
        return blockchainStore.getTokenMetadata(comparingToken.value);
    } else {
        return null;
    }
});
const realAmount = computed(() => Number(amount.value) / Math.pow(10, tokenMeta.value?.decimals ?? 0));
const tokenPrice = computed(() => coingeckoStore.getOnlyTokenPrice(token.value));
const comparingTokenPrice = computed(() => {
    if (comparingToken.value) {
        return coingeckoStore.getOnlyTokenPrice(comparingToken.value);
    } else {
        return 0;
    }
});
const singleTokenSwapTokens = computed(() => {
    if (comparingTokenPrice.value === 0) {
        return 'N/A';
    }

    return formatRealValue(tokenPrice.value / comparingTokenPrice.value, comparingTokenMeta.value?.decimals ?? 0);
});
const swapTokens = computed(() => {
    if (comparingTokenPrice.value === 0) {
        return 'N/A';
    }

    return formatRealValue(Number(realAmount.value) * tokenPrice.value / comparingTokenPrice.value,
        comparingTokenMeta.value?.decimals ?? 0);
});

// METHODS --------------------------------------------------------------------

function showComparing() {
    if (isComparing.value) {
        comparingToken.value = null;
    } else {
        comparingToken.value = new PublicKey('So11111111111111111111111111111111111111112'); // Wrapped SOL
    }
}

function loadTokenValues() {
    if (comparingToken.value) {
        coingeckoStore.getTokenPrices([token.value, comparingToken.value]);
    } else {
        coingeckoStore.getTokenPrices([token.value]);
    }
}

function filterTokensByCoingeckoId(token: TokenMeta) {
    return !!token.coingeckoId;
}

function exchangeTokens() {
    const tokenAux = token.value;
    token.value = comparingToken.value!;
    comparingToken.value = tokenAux;
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------

onMounted(() => {
    loadTokenValues();
});
</script>

<template>
    <div class="q-px-lg q-py-md">
        <AlertBox type="info" class="q-mb-md">
            <div>Powered by <a href="https://www.coingecko.com" target="_blank">CoinGecko</a></div>
        </AlertBox>
        <p>Pick the token to know its current price. Also if you want to see the price of a token into
            another token, please pick a comparing token.</p>
        <div class="text-secondary text-caption text-bold q-mt-md">SPL Token</div>
        <SplTokenInput v-model="token"
                       @blur="loadTokenValues"
                       @keydown.enter="loadTokenValues"
                       :filter="filterTokensByCoingeckoId"
                       show-coingecko-id/>
        <div class="text-secondary text-caption text-bold q-mt-md">Num tokens</div>
        <TokenAmountInput v-model="amount" :in-bps="true" :token="token"/>
        <div class="relative-position" v-if="isComparing">
            <q-separator class="q-my-lg"/>
            <q-btn dense
                   color="secondary"
                   text-color="black"
                   unelevated
                   round
                   no-caps
                   size="md"
                   class="q-px-sm q-py-none absolute-center rounded-borders"
                   @click="exchangeTokens">
                <q-icon name="fa-solid fa-arrow-right-arrow-left" size="16px"/>
            </q-btn>
        </div>
        <div class="text-secondary text-caption text-bold q-mt-md row justify-between">
            <div>Compare to SPL Token</div>
            <q-toggle :model-value="isComparing"
                      dense
                      @update:model-value="showComparing"
                      size="xs"
                      label="Enable?"
                      left-label/>
        </div>
        <SplTokenInput v-model="comparingToken"
                       v-if="isComparing"
                       :filter="filterTokensByCoingeckoId"
                       show-coingecko-id/>
        <q-separator class="q-my-lg"/>
        <q-list dense>
            <q-item class="flex items-center">
                <q-item-label><b>Token price</b>:
                    <VsCurrencyText :amount="1" :decimals="2" :show-equal="false" :token="token"/>
                </q-item-label>
            </q-item>
            <q-item class="flex items-center" v-if="isComparing">
                <q-item-label><b>Comparing token price</b>:
                    <VsCurrencyText :amount="1" :decimals="2" :show-equal="false" :token="comparingToken"/>
                </q-item-label>
            </q-item>
            <q-item class="flex items-center">
                <q-item-label><b>Total tokens price</b>:
                    <VsCurrencyText :amount="realAmount" :decimals="2" :show-equal="false" :token="token"/>
                </q-item-label>
            </q-item>
            <template v-if="isComparing">
                <q-item class="flex items-center">
                    <q-item-label><b>Single token swap</b>: 1 {{ tokenMeta?.symbol ?? '???' }} = {{
                            singleTokenSwapTokens
                        }}
                        {{ comparingTokenMeta?.symbol ?? '???' }}
                    </q-item-label>
                </q-item>
                <q-item class="flex items-center">
                    <q-item-label><b>All tokens swap</b>:
                        {{ formatBasisPoints(amount, tokenMeta?.decimals ?? 0) }} {{ tokenMeta?.symbol ?? '???' }} = {{
                            swapTokens
                        }}
                        {{ comparingTokenMeta?.symbol ?? '???' }}
                    </q-item-label>
                </q-item>
            </template>
        </q-list>
    </div>
</template>

<style lang="scss" scoped></style>