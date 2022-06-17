<script lang="ts" setup>
import {DrawerUtilityButton} from 'src/types/drawer';
import {useRightDrawerStore} from 'stores/rightDrawer';
import {computed} from 'vue';
import {useMenuStore} from 'stores/menu';
import {MAX_PINNED_UTILITIES} from 'src/constants';

const props = defineProps<{
    button: DrawerUtilityButton;
}>();

const rightDrawerStore = useRightDrawerStore();
const menuStore = useMenuStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const isActive = computed(() => rightDrawerStore.drawerState === props.button.rightDrawerOption);
const isPinned = computed(
    () => menuStore.pinnedUtilities.findIndex(v => v.rightDrawerOption === props.button.rightDrawerOption) >= 0);
const canPin = computed(() => isPinned.value || menuStore.pinnedUtilities.length < MAX_PINNED_UTILITIES);

// METHODS --------------------------------------------------------------------

async function open() {
    if (isActive.value) {
        await rightDrawerStore.close();
    } else {
        await rightDrawerStore.open(props.button.rightDrawerOption);
    }
}

function pin() {
    if (isPinned.value) {
        menuStore.unpin(props.button.rightDrawerOption);
    } else {
        menuStore.pin(props.button.rightDrawerOption);
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-card class="utility-card column">
        <q-card-section class="row items-center gap-md">
            <div class="q-ml-sm" :class="{'text-secondary': isActive}">
                <q-icon :name="button.icon" size="20px"/>
            </div>
            <div class="title" :class="{'text-secondary': isActive}">{{ button.name }}</div>
            <q-space/>
            <div v-if="canPin">
                <q-btn dense round class="rounded-borders" size="10px" flat @click.stop="pin">
                    <q-icon name="fa-solid fa-thumbtack"
                            class="pinned-icon"
                            size="12px"
                            color="secondary"
                            v-if="isPinned"/>
                    <q-icon name="fa-solid fa-thumbtack" size="12px" color="grey-8" v-else/>
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">{{ isPinned ? 'Unpin' : 'Pin' }}
                    </q-tooltip>
                </q-btn>
            </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="text-caption text-bold">
            {{ button.description }}
        </q-card-section>
        <q-space/>
        <q-card-actions class="flex flex-center">
            <q-btn color="primary" unelevated @click="open" no-caps>{{ isActive ? 'Close' : 'Open' }}</q-btn>
        </q-card-actions>
    </q-card>
</template>

<style lang="scss" scoped>
.utility-card {
    width: 300px;
    max-width: 80vw;

    .title {
        font-size: 20px;
    }
}

.pinned-icon {
    transform: rotateZ(45deg);
}
</style>