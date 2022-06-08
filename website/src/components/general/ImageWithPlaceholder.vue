<script lang="ts" setup>

import {ref} from 'vue';

const props = defineProps<{
    src: string,
}>();

// REFS -----------------------------------------------------------------------

const imgSrc = ref(props.src);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function onError() {
    imgSrc.value = '/placeholder.jpg';
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-img :src="imgSrc" @error="onError"/>
</template>