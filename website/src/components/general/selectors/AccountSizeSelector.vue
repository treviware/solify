<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import SearchBar from 'components/general/SearchBar.vue';
import {QInfiniteScroll} from 'quasar';
import {ACCOUNTS_INFO} from 'src/constants/accounts';
import {AccountInfoElement} from 'src/types/accounts';

const tokensPerPage = 20;

const props = defineProps<{
    initialSearch?: string, showSize?: boolean
}>();
const emits = defineEmits<{
    (e: 'select', account: AccountInfoElement): void,
}>();

// REFS -----------------------------------------------------------------------

const search = ref(props.initialSearch ?? '');
const maxPage = ref(0);

// COMPUTED -------------------------------------------------------------------

const filteredAccount = computed<AccountInfoElement[]>(() => {
    if (search.value === '') {
        return ACCOUNTS_INFO.slice(0);
    }

    const searchLower = search.value.toLowerCase();
    return ACCOUNTS_INFO
        .filter(account => account.programName.toLowerCase().indexOf(searchLower) !== -1 ||
            account.name.toLowerCase().indexOf(searchLower) !== -1);
});

const accounts = computed<(AccountInfoElement & { sizeStr: string })[]>(() => {
    return filteredAccount.value.slice(0, tokensPerPage * (maxPage.value + 1)).map(v => ({
        ...v,
        sizeStr: `${v.size} B`,
    }));
});

// METHODS --------------------------------------------------------------------

function selectAccount(account: AccountInfoElement) {
    emits('select', account);
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
</script>

<template>
    <q-card class="token-selector">
        <q-card-section class="full-height column">
            <h6 class="text-center q-mb-sm">Account selector</h6>
            <SearchBar v-model="search" placeholder="Search account" :debounce="300"/>
            <q-separator/>
            <div class="overflow-auto col q-mt-md">
                <q-infinite-scroll @load="onLoad" :offset="250" ref="infiniteScroll" class="full-width">
                    <q-list dense>
                        <q-item class="q-mb-xs"
                                v-for="account in accounts"
                                :key="account.programName + '::' + account.name"
                                clickable
                                @click="selectAccount(account)">
                            <q-item-section>
                                <q-item-label><b>{{ account.programName }}</b> :: {{ account.name }}</q-item-label>
                            </q-item-section>
                            <q-item-section side v-if="showSize">
                                <q-item-label>{{ account.sizeStr }}</q-item-label>
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