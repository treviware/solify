<script lang="ts" setup>
import {computed, onBeforeMount, ref} from 'vue';
import {useProgramExplorerAppStore} from 'stores/apps/programExplorer';
import {useRouter} from 'vue-router';
import ImageWithPlaceholder from 'components/general/ImageWithPlaceholder.vue';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import ProgramInstructionCard from 'components/apps/ProgramExplorerPage/ProgramInstructionCard.vue';
import {useGlobalStore} from 'stores/global';
import {encodeToCssId} from 'src/utils/strings';
import {debounce} from 'quasar';
import ProgramAccountCard from 'components/apps/ProgramExplorerPage/ProgramAccountCard.vue';
import ProgramAccountTypeCard from 'components/apps/ProgramExplorerPage/ProgramAccountTypeCard.vue';

const props = defineProps<{
    programId: string;
}>();

const router = useRouter();
const programExplorerAppStore = useProgramExplorerAppStore();
const globalStore = useGlobalStore();

// REFS -----------------------------------------------------------------------
const content = ref<'ixn' | 'accounts' | 'pdas'>('ixn');
const mainContentEl = ref<HTMLElement | null>(null);
const indexEl = ref<HTMLElement | null>(null);
const showFab = ref(false);

// COMPUTED -------------------------------------------------------------------
const program = computed(() => programExplorerAppStore.programs.find(v => v.address.toString() === props.programId));
const instructions = computed(() => program.value?.instructions ?? []);
const accounts = computed(() => program.value?.accounts?.accounts ?? []);
const accountTypes = computed(() => program.value?.accounts?.types ?? []);
const pdas = computed(() => program.value?.pdas ?? []);
const instructionIndexEntries = computed(() => instructions.value.map(v => ({
    name: v.name,
    id: encodeToCssId(v.name),
})));
const accountIndexEntries = computed(() => accounts.value.map(v => ({
    name: v.name,
    id: encodeToCssId(v.name),
})));
const accountTypeIndexEntries = computed(() => accountTypes.value.map(v => ({
    name: v.name,
    id: encodeToCssId(`Type${v.name}`),
})));
const pdasIndexEntries = computed(() => pdas.value.map(v => ({
    name: v.name,
    id: encodeToCssId(v.name),
})));

// METHODS --------------------------------------------------------------------
function goBack() {
    router.push({
        name: 'ProgramExplorer',
    });
}

function goToHash(id: string) {
    document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
    });
}

function goUp() {
    mainContentEl.value?.scrollIntoView({
        behavior: 'smooth',
    });
}

function onScroll(position: number) {
    const offsetTop = indexEl.value?.offsetTop ?? 0;
    const offsetHeight = indexEl.value?.offsetHeight ?? 0;
    showFab.value = position > offsetTop + offsetHeight;
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
    <div class="q-pa-lg" v-if="program" ref="mainContentEl" v-scroll="debounce(onScroll, 50)">
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
            <q-separator class="q-mt-md"/>
            <div class="row flex-center gap-x-md q-my-sm">
                <q-btn unelevated :color="content !== 'ixn' ? 'grey-8' : 'primary'" @click="content = 'ixn'">
                    {{ instructions.length }}
                    {{ instructions.length === 1 ? 'Instruction' : 'Instructions' }}
                </q-btn>
                <q-btn unelevated :color="content !== 'accounts' ? 'grey-8' : 'primary'" @click="content = 'accounts'">
                    {{ accounts.length }}
                    {{ accounts.length === 1 ? 'Account' : 'Accounts' }}
                </q-btn>
                <q-btn unelevated :color="content !== 'pdas' ? 'grey-8' : 'primary'" @click="content = 'pdas'">
                    {{ pdas.length }}
                    {{ pdas.length === 1 ? 'PDA' : 'PDAs' }}
                </q-btn>
            </div>
            <q-separator/>
            <div class="q-mt-lg" v-if="content === 'ixn'">
                <div ref="indexEl" v-if="instructionIndexEntries.length !== 0">
                    <h6 class="text-center q-mt-md q-mb-xs">Index</h6>
                    <q-list dense>
                        <q-item dense
                                v-for="(entry, i) in instructionIndexEntries"
                                :key="entry.id"
                                clickable
                                @click="goToHash(entry.id)">
                            <q-item-section>
                                <q-item-label>{{ i + 1 }}. {{ entry.name }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <q-separator class="q-mb-md"/>
                <div v-if="instructions.length === 0" class="text-bold text-primary text-center">The program does not
                    contain any instruction
                </div>
                <template v-else>
                    <ProgramInstructionCard :instruction="instruction"
                                            v-for="(instruction, i) in instructions"
                                            :key="instruction.name"
                                            :index="i"
                                            :id="encodeToCssId(instruction.name)"
                                            class="q-mb-lg"/>
                </template>
            </div>
            <div class="q-mt-lg" v-if="content === 'accounts'">
                <div ref="indexEl" v-if="accountIndexEntries.length !== 0 || accountTypeIndexEntries.length !== 0">
                    <h6 class="text-center q-mt-md q-mb-xs">Index</h6>
                    <p class="text-bold">Accounts</p>
                    <q-list dense>
                        <q-item dense
                                v-for="(entry, i) in accountIndexEntries"
                                :key="entry.id"
                                clickable
                                @click="goToHash(entry.id)">
                            <q-item-section>
                                <q-item-label>{{ i + 1 }}. {{ entry.name }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                    <p class="text-bold">Types</p>
                    <q-list dense>
                        <q-item dense
                                v-for="(entry, i) in accountTypeIndexEntries"
                                :key="entry.id"
                                clickable
                                @click="goToHash(entry.id)">
                            <q-item-section>
                                <q-item-label>{{ i + 1 }}. {{ entry.name }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <q-separator class="q-mb-md"/>
                <div v-if="accounts.length === 0" class="text-bold text-primary text-center">The program does not
                    contain any account
                </div>
                <template v-else>
                    <ProgramAccountCard :account="account"
                                        v-for="(account, i) in accounts"
                                        :key="account.name"
                                        :index="i"
                                        :id="encodeToCssId(account.name)"
                                        class="q-mb-lg"/>
                </template>
                <div v-if="accountTypes.length === 0" class="text-bold text-primary text-center">The program does not
                    contain any type
                </div>
                <template v-else>
                    <p class="text-bold text-center q-mb-md">Types</p>
                    <ProgramAccountTypeCard :type="accountType"
                                            v-for="(accountType, i) in accountTypes"
                                            :key="accountType.name"
                                            :index="i"
                                            :id="encodeToCssId(`Type${accountType.name}`)"
                                            class="q-mb-lg"/>
                </template>
            </div>
            <div class="q-mt-lg" v-if="content === 'pdas'">
                <div ref="indexEl" v-if="pdasIndexEntries.length !== 0">
                    <h6 class="text-center q-mt-md q-mb-xs">Index</h6>
                    <q-list dense>
                        <q-item dense
                                v-for="(entry, i) in pdasIndexEntries"
                                :key="entry.id"
                                clickable
                                @click="goToHash(entry.id)">
                            <q-item-section>
                                <q-item-label>{{ i + 1 }}. {{ entry.name }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <q-separator class="q-mb-md"/>
                <div v-if="pdas.length === 0" class="text-bold text-primary text-center">The program does not contain
                    any PDA
                </div>
                <template v-else>TODO</template>
            </div>
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="showFab">
            <q-btn fab-mini icon="fa-solid fa-chevron-up" color="primary" @click="goUp"></q-btn>
        </q-page-sticky>
    </div>
</template>

<style lang="scss" scoped>
.program-image {
    width: 40px
}
</style>