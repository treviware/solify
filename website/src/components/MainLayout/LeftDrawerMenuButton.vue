<script lang="ts" setup>
import {computed} from 'vue';
import {useRouter} from 'vue-router';
import {useRightDrawerStore} from 'stores/rightDrawer';
import {RightDrawerState} from 'src/types/drawer';
import {useMenuStore} from 'stores/menu';
import {MAX_PINNED_TOOLS} from 'src/constants';
import {useRouterStore} from 'stores/router';

const props = defineProps<{
    index?: number, icon: string, name?: string, pathName?: string, rightDrawerOption?: RightDrawerState
}>();

const router = useRouter();
const routerStore = useRouterStore();
const rightDrawerStore = useRightDrawerStore();
const menuStore = useMenuStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const isActive = computed(() => {
    if (props.pathName) {
        return props.pathName === router.currentRoute.value.name;
    } else {
        return rightDrawerStore.drawerState === props.rightDrawerOption;
    }
});

const isPinned = computed(() => props.index != null && props.index < menuStore.pinnedTools.length);
const canPin = computed(() => isPinned.value || menuStore.pinnedTools.length < MAX_PINNED_TOOLS);

// METHODS --------------------------------------------------------------------

async function open() {
    if (isActive.value) {
        if (props.rightDrawerOption) {
            await rightDrawerStore.close();
        }

        return;
    }

    if (props.pathName) {
        await routerStore.push({
            name: props.pathName,
        });
    } else {
        await rightDrawerStore.open(props.rightDrawerOption!);
    }
}

function pin() {
    if (isPinned.value) {
        menuStore.unpin(props.rightDrawerOption!);
    } else {
        menuStore.pin(props.rightDrawerOption!);
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-item clickable @click="open" :class="{isActive}">
        <q-item-section avatar>
            <q-icon :name="icon" size="18px"/>
        </q-item-section>
        <q-item-section>
            <q-item-label class="text-caption text-bold">{{ name }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="index != null && canPin">
            <q-btn dense round class="rounded-borders" size="10px" flat @click.stop="pin">
                <q-icon name="fa-solid fa-thumbtack" class="pinned-icon" size="12px" color="secondary" v-if="isPinned"/>
                <q-icon name="fa-solid fa-thumbtack" size="12px" color="grey-8" v-else/>
                <q-tooltip class="text-no-wrap text-white text-bold shadow-2">{{ isPinned ? 'Unpin' : 'Pin' }}
                </q-tooltip>
            </q-btn>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>
.q-item {
    &:deep(.q-item__section--avatar) {
        min-width: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin-right: 10px;
    }

    &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 0;
        background-color: $secondary;
        transition: width 0.3s;
    }

    &.isActive {
        color: $secondary;
        background-color: transparentize($secondary, 0.9);

        &::after {
            width: 4px;
        }
    }
}

.pinned-icon {
    transform: rotateZ(45deg);
}
</style>