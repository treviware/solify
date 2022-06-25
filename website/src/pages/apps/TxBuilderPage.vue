<script lang="ts" setup>
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import TransactionGroupView from 'components/apps/TxBuilderPage/TransactionGroupView.vue';

const txBuilderApp = useTxBuilderApp();

// REFS -----------------------------------------------------------------------
const {
    groups,
    groupIndex,
} = storeToRefs(txBuilderApp);

// COMPUTED -------------------------------------------------------------------
const canRemoveGroup = computed(() => groups.value.length > 1);

// METHODS --------------------------------------------------------------------
function copyLink() {
    console.log('TODO: copy link');
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
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
                    <q-btn @click="txBuilderApp.addGroup()" flat round class="rounded-borders" dense size="sm">
                        <q-icon name="fa-solid fa-plus"/>
                    </q-btn>
                    <q-btn @click="copyLink" flat round class="rounded-borders" dense size="sm">
                        <q-icon name="fa-solid fa-link"/>
                    </q-btn>
                </div>
            </q-tabs>
        </div>
        <div class="container q-pa-lg row justify-center items-start no-wrap gap-md">
            <div class="tx-container col">
                <TransactionGroupView/>
            </div>
            <div class="summary">
                Menu
            </div>
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

    .container {
        flex-direction: column-reverse;

        .tx-container {
            width: 100%;
        }
    }
}
</style>