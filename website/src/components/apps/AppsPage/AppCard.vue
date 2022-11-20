<script lang="ts" setup>
import {AppCategoryButton} from 'src/types/apps';
import {useRouter} from 'vue-router';

const props = defineProps<{
    button: AppCategoryButton;
}>();

const router = useRouter();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
function open() {
    router.push({name: props.button.pathName});
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-card class="tool-card column">
        <q-card-section class="row items-center no-wrap gap-md full-width">
            <div class="q-ml-sm">
                <q-icon :name="button.icon" size="20px"/>
            </div>
            <div class="title">{{ button.name }}</div>
            <q-space/>
        </q-card-section>
        <q-separator/>
        <q-card-section class="text-caption text-bold full-width">
            {{ button.description }}
        </q-card-section>
        <q-space/>
        <q-card-section class="flex flex-center full-width">
            <q-btn color="primary" unelevated @click="open" no-caps class="full-width">Open</q-btn>
        </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped>
.tool-card {
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