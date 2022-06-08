<script lang="ts" setup>
import {computed, onBeforeMount} from 'vue';
import {useRouter} from 'vue-router';
import {useRightDrawerStore} from 'stores/rightDrawer';

const props = defineProps<{
    icon: string, name?: string, pathName: string, drawerOverlay: boolean, minContentSize?: number, iconAsText?: boolean, subText?: string
}>();

const router = useRouter();
const rightDrawerStore = useRightDrawerStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const isActive = computed(() => props.pathName === router.currentRoute.value.name);

// METHODS --------------------------------------------------------------------

function open() {
    if (isActive.value) {
        return;
    }

    router.push({
        name: props.pathName,
    });
    rightDrawerStore.setOverlay(props.drawerOverlay, props.minContentSize ?? 0);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------

onBeforeMount(() => {
    if (isActive.value) {
        rightDrawerStore.setOverlay(props.drawerOverlay, props.minContentSize ?? 0);
    }
});
</script>

<template>
    <q-btn class="rounded-borders"
           :color="isActive ? 'primary' : 'grey-8'"
           dense
           :flat="!isActive"
           round
           size="20px"
           :unelevated="isActive"
           @click="open">
        <div class="relative-position">
            <div>
                <q-icon :name="icon" size="18px" v-if="!iconAsText"/>
                <span v-else class="text">{{ icon }}</span>
            </div>
            <div class="sub-text text-center absolute-bottom" v-if="subText">{{ subText }}</div>
        </div>
        <q-tooltip anchor="center end"
                   self="center start"
                   transition-hide="jump-left"
                   transition-show="jump-right"
                   v-if="name"
                   class="text-no-wrap bg-secondary text-black text-bold shadow-2">{{
                name
            }}
        </q-tooltip>
    </q-btn>
</template>

<style lang="scss" scoped>
.text {
    font-size: 16px;
    font-style: italic;
}

.sub-text {
    font-size: 8px;
    bottom: -12px;
}
</style>