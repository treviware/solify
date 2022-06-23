<script lang="ts" setup>
import {computed, onBeforeMount} from 'vue';
import {useProgramExplorerAppStore} from 'stores/apps/programExplorer';
import {useRouter} from 'vue-router';
import ImageWithPlaceholder from 'components/general/ImageWithPlaceholder.vue';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import ProgramInstructionCard from 'components/apps/ProgramExplorerPage/ProgramInstructionCard.vue';
import {useGlobalStore} from 'stores/global';

const props = defineProps<{
    programId: string;
}>();

const router = useRouter();
const programExplorerAppStore = useProgramExplorerAppStore();
const globalStore = useGlobalStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const program = computed(() => programExplorerAppStore.programs.find(v => v.address.toString() === props.programId));
const instructions = computed(() => program.value?.instructions ?? []);
const accounts = computed(() => program.value?.accounts ?? []);
const pdas = computed(() => program.value?.pdas ?? []);

// METHODS --------------------------------------------------------------------
function goBack() {
    router.push({
        name: 'ProgramExplorer',
    });
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
onBeforeMount(() => {
    if (program.value === undefined) {
        router.replace({
            name: 'ProgramExplorer',
        });
    }
});

</script>

<template>
    <div class="q-pa-lg" v-if="program">
        <div class="viewport-width">
            <h4 style="white-space: break-spaces">
                <q-btn dense
                       flat
                       icon="fa-solid fa-chevron-left"
                       round
                       class="rounded-borders q-mr-sm"
                       @click="goBack"/>
                <ImageWithPlaceholder v-if="program?.icon"
                                      :src="program?.icon ?? '/placeholder.jpg'"
                                      placeholder-src="/placeholder.jpg"
                                      no-spinner
                                      class="program-image"
                                      :ratio="1"/>
                {{ program.name }}
            </h4>
            <p class="q-mt-md"> {{ program.description }}</p>
            <div class="q-mt-lg row items-start justify-center gap-md">
                <q-card>
                    <q-card-section class="column flex-center">
                        <div class="text-bold text-primary">Program address</div>
                        <div>
                            <PubkeyBadge :long="!globalStore.isMobile" :pubkey="program.address" show-menu show-copy/>
                        </div>
                    </q-card-section>
                </q-card>
                <q-card>
                    <q-card-section>
                        <div class="text-bold text-primary text-center">Glossary</div>
                        <div class="q-mb-xs">
                            <b>Readonly</b>: whether this value can be configured or is auto-computed/fixed.
                        </div>
                        <div class="q-mb-xs">
                            <b>Mutable</b>: whether this value can be mutated by the on-chain program or not.
                        </div>
                        <div class="q-mb-xs">
                            <b>Signer</b>: whether this account must sign the transaction or not.
                        </div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="q-mt-lg">
                <h6>{{ instructions.length }} {{ instructions.length === 1 ? 'Instruction' : 'Instructions' }}</h6>
                <p>On-chain methods that anyone can execute inside a transaction.</p>
                <q-separator class="q-mt-sm q-mb-md"/>
                <div v-if="instructions.length === 0" class="text-bold text-primary text-center">The program does not
                    contain any instruction
                </div>
                <template v-else>
                    <ProgramInstructionCard :instruction="instruction"
                                            v-for="(instruction, i) in instructions"
                                            :key="instruction.name"
                                            :index="i"/>
                </template>
            </div>
            <div class="q-mt-xl">
                <h6>{{ accounts.length }} {{ accounts.length === 1 ? 'Account' : 'Accounts' }}</h6>
                <p>Data stored on-chain related to the current program.</p>
                <q-separator class="q-mt-sm q-mb-md"/>
                <div v-if="accounts.length === 0" class="text-bold text-primary text-center">The program does not
                    contain any account
                </div>
                <template v-else>TODO</template>
            </div>
            <div class="q-mt-xl">
                <h6>{{ pdas.length }} {{ pdas.length === 1 ? 'PDA' : 'PDAs' }}</h6>
                <p>Program Derived Addresses the program uses to assign accounts.</p>
                <q-separator class="q-mt-sm q-mb-md"/>
                <div v-if="pdas.length === 0" class="text-bold text-primary text-center">The program does not contain
                    any PDA
                </div>
                <template v-else>TODO</template>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.program-image {
    width: 40px
}
</style>