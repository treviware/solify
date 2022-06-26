<script lang="ts" setup>
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import TransactionGroupView from 'components/apps/TxBuilderPage/TransactionGroupView.vue';
import TransactionSummary from 'components/apps/TxBuilderPage/TransactionSummary.vue';
import {useGlobalStore} from 'stores/global';

const txBuilderApp = useTxBuilderApp();
const globalStore = useGlobalStore();

// REFS -----------------------------------------------------------------------
const {
    groups,
    groupIndex,
    currentGroup,
} = storeToRefs(txBuilderApp);

// COMPUTED -------------------------------------------------------------------
const canRemoveGroup = computed(() => groups.value.length > 1);
const isMobile = computed(() => globalStore.windowWidth <= 1000);

// METHODS --------------------------------------------------------------------
function addGroup() {
    txBuilderApp.addGroup();
    groupIndex.value = groups.value.length - 1;
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="full-height column">
        <div class="header">
            <q-tabs v-model="groupIndex"
                    dense
                    class="tabs"
                    align="left"
                    active-color="primary"
                    left-icon="fa-solid fa-chevron-left"
                    right-icon="fa-solid fa-chevron-right"
                    outside-arrows
                    mobile-arrows>
                <q-tab :name="i" v-for="(group, i) in groups" :key="i" no-caps class="q-pl-md q-pr-sm">
                    <div class="row items-center no-wrap gap-xs">
                        <div>
                            <q-icon name="fa-solid fa-book"/>
                        </div>
                        <div class="text-bold text-body2 q-mr-sm">{{ group.name }}</div>
                        <div v-if="canRemoveGroup">
                            <q-btn @click.stop="txBuilderApp.removeGroup(i)"
                                   flat
                                   round
                                   class="rounded-borders"
                                   dense
                                   size="sm">
                                <q-icon name="fa-solid fa-close"/>
                            </q-btn>
                        </div>
                    </div>
                </q-tab>
                <q-space/>
                <q-separator vertical/>
                <div class="q-mx-sm row no-wrap gap-sm">
                    <q-btn @click="addGroup" flat round class="rounded-borders" color="primary" dense size="sm">
                        <q-icon name="fa-solid fa-plus"/>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Add group</q-tooltip>
                    </q-btn>
                    <q-btn flat round class="rounded-borders" dense size="sm">
                        <q-icon name="fa-solid fa-pencil" size="14px"/>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Rename group</q-tooltip>
                        <q-popup-edit v-model="currentGroup.name" auto-save v-slot="scope">
                            <q-input v-model="scope.value" :maxlength="20" dense autofocus @keyup.enter="scope.set"/>
                        </q-popup-edit>
                    </q-btn>
                </div>
            </q-tabs>
        </div>
        <div class="container q-pa-lg row justify-center items-start no-wrap gap-md col">
            <template v-if="!isMobile">
                <div class="tx-container col full-height">
                    <q-scroll-area class="full-width full-height" content-active-style="full-width">
                        <TransactionGroupView/>
                    </q-scroll-area>
                </div>
                <div class="summary full-height">
                    <div class="full-width full-height">
                        <q-scroll-area class="full-width full-height">
                            <TransactionSummary/>
                        </q-scroll-area>
                    </div>
                </div>
            </template>
            <q-scroll-area class="full-width full-height" v-else>
                <div class="summary q-mb-lg">
                    <TransactionSummary/>
                </div>
                <div class="tx-container col">
                    <TransactionGroupView/>
                </div>
            </q-scroll-area>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tabs {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:deep(.q-tabs__arrow) {
        font-size: 14px;
    }
}

.summary {
    width: 300px;
}

.tx-container {
    max-width: 800px;
}

@media (max-width: 1000px) {
    .summary {
        width: 100%;
    }
}
</style>