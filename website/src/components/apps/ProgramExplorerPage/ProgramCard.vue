<script lang="ts" setup>
import {ProgramDefinition} from 'src/types/programs/programDefinition';
import ImageWithPlaceholder from 'components/general/ImageWithPlaceholder.vue';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import {useRouter} from 'vue-router';

const props = defineProps<{
    program: ProgramDefinition<any, any>;
}>();

const router = useRouter();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
function open() {
    router.push({
        name: 'Program',
        params: {
            programId: props.program.address.toBase58(),
        },
    });
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-card class="program-card column">
        <q-card-section class="row items-center no-wrap gap-md full-width">
            <div v-if="program.icon">
                <ImageWithPlaceholder :src="program.icon ?? '/placeholder.jpg'"
                                      placeholder-src="/placeholder.jpg"
                                      no-spinner

                                      class="program-image"
                                      :ratio="1"/>
            </div>
            <div class="title">
                <div>{{ program.name }}</div>
                <div>
                    <PubkeyBadge :pubkey="props.program.address" show-copy show-menu class="address"/>
                </div>
            </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="text-caption text-bold full-width">
            <div>{{ program.description }}</div>
        </q-card-section>
        <q-space/>
        <q-card-section class="flex flex-center full-width">
            <q-btn color="primary" unelevated @click="open" no-caps class="full-width">Inspect</q-btn>
        </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped>
.program-card {
    width: 350px;
    max-width: 80vw;

    .title {
        font-size: 20px;
    }

    .address {
        font-size: 11px;
    }

    .program-image {
        width: 50px;
    }
}
</style>