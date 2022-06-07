<script lang="ts" setup>
import {computed} from 'vue';
import {useRouter} from 'vue-router';

const props = defineProps<{
    icon: string, name?: string, pathName: string,
}>();

const router = useRouter();

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
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
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
        <q-icon :name="icon" size="18px"/>
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

<style lang="scss" scoped></style>