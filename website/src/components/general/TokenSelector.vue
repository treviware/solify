<script lang="ts" setup>
import {computed, onBeforeMount, ref, watch} from 'vue';
import SearchBar from 'components/general/SearchBar.vue';
import {TokenMeta, useBlockchainStore} from 'stores/blockchain';
import ImageWithPlaceholder from 'components/general/ImageWithPlaceholder.vue';
import {QInfiniteScroll} from 'quasar';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import {useGlobalStore} from 'stores/global';

const tokensPerPage = 20;

const props = defineProps<{
    initialSearch?: string,
}>();
const emits = defineEmits<{
    (e: 'select', token: TokenMeta): void,
}>();
const blockchainStore = useBlockchainStore();
const globalStore = useGlobalStore();

// REFS -----------------------------------------------------------------------

const search = ref(props.initialSearch ?? '');
const maxPage = ref(0);

// COMPUTED -------------------------------------------------------------------

const filteredSplTokens = computed<TokenMeta[]>(() => {
    if (search.value === '') {
        return blockchainStore.tokenList.slice(0);
    }

    const searchLower = search.value.toLowerCase();
    return blockchainStore.tokenList
        .filter(token => (token.name ?? '').toLowerCase().indexOf(searchLower) !== -1 ||
            (token.symbol ?? '').toLowerCase().indexOf(searchLower) !== -1);
});

const splTokens = computed<TokenMeta[]>(() => {
    return filteredSplTokens.value.slice(0, tokensPerPage * (maxPage.value + 1));
});

// METHODS --------------------------------------------------------------------

function selectToken(token: TokenMeta) {
    emits('select', token);
}

function onLoad(index: number, done: () => void) {
    maxPage.value += 1;
    done();
}

// WATCHES --------------------------------------------------------------------

watch(search, () => {
    maxPage.value = 0;
});

// HOOKS ----------------------------------------------------------------------

onBeforeMount(() => {
    blockchainStore.loadTokenList();
});
</script>

<template>
    <q-card class="token-selector">
        <q-card-section class="full-height column">
            <h6 class="text-center q-mb-sm">SPL token selector</h6>
            <SearchBar v-model="search" placeholder="Search SPL token" :debounce="300"/>
            <div class="overflow-auto col q-mt-md" v-if="blockchainStore.tokenList.length > 0">
                <q-infinite-scroll @load="onLoad" :offset="250" ref="infiniteScroll" class="full-width">
                    <q-list dense>
                        <q-item class="q-mb-xs"
                                v-for="token in splTokens"
                                :key="token.address"
                                clickable
                                @click="selectToken(token)">
                            <q-item-section avatar>
                                <q-avatar rounded>
                                    <ImageWithPlaceholder :src="token.logoURI ?? '/placeholder.jpg'"
                                                          placeholder-src="/placeholder.jpg"
                                                          no-spinner
                                                          :ratio="1"/>
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <div><b>{{ token.symbol ?? "???" }}</b> - {{ token.name ?? "Unknown" }}</div>
                                <div>
                                    <PubkeyBadge :pubkey="token.address" :long="globalStore.windowWidth > 500"/>
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>

                    <template v-slot:loading>
                        <div class="row justify-center q-my-md">
                            <q-spinner-dots color="primary" size="40px"/>
                        </div>
                    </template>
                </q-infinite-scroll>
            </div>
            <div class="row justify-center q-my-md" v-else>
                <q-spinner-dots color="primary" size="40px"/>
            </div>
        </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped>
.token-selector {
    width: 500px;
    max-width: 100vw;
    height: 999px;
    max-height: 500px;
}
</style>