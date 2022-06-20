<script lang="ts" setup>
import AlertBox from 'components/general/AlertBox.vue';
import {useVanityAddressToolStore} from 'stores/pages/tools/vanityAddress';
import {storeToRefs} from 'pinia';
import {computed, onUnmounted, ref, watch} from 'vue';
import {decodeVanityAddressRules, encodeVanityAddressRules, VanityAddressMessage} from 'src/types/tools/vanityAddress';
import VanityAddressRuleBox from 'components/tools/VanityAddressPage/VanityAddressRuleBox.vue';
import {MAX_VANITY_ADDRESS_RESULTS, MAX_VANITY_ADDRESS_WORKERS} from 'src/constants';
import {useQuasar} from 'quasar';
import VanityAddressResultBox from 'components/tools/VanityAddressPage/VanityAddressResultBox.vue';
import {Keypair} from '@solana/web3.js';
import base58 from 'bs58';
import {processUriStoreDataOnMounted, removeStoreDataFromUriOnUnmounted, writeToolParamsIntoUri} from 'src/utils/tools';

const quasar = useQuasar();
const vanityAddressToolStore = useVanityAddressToolStore();
const workers: Worker[] = [];

// REFS -----------------------------------------------------------------------
const {
    rules,
    results,
} = storeToRefs(vanityAddressToolStore);
const isRunning = ref(false);

// COMPUTED -------------------------------------------------------------------
const canAddRule = computed(() => rules.value.length < 10);
const encodedRules = computed(() => encodeVanityAddressRules(rules.value));

// METHODS --------------------------------------------------------------------
function addRule() {
    rules.value.push({
        type: 'startsWith',
        value: '',
        maxDifferentChars: 0,
        insensitive: false,
    });
}

function removeRule(index: number) {
    rules.value.splice(index, 1);
}

function run() {
    if (workers.length > 0) {
        stop();
    } else {
        // Validate rules.
        if (rules.value.length === 0) {
            quasar.notify({
                message: 'Please add at least one rule',
                color: 'negative',
            });
            return;
        }

        if (rules.value.some(v => v.value.length === 0)) {
            quasar.notify({
                message: 'Please fill in all rules',
                color: 'negative',
            });
            return;
        }

        isRunning.value = true;

        for (let i = 0; i < MAX_VANITY_ADDRESS_WORKERS; i++) {
            const worker = new Worker(new URL('../../workers/vanityAddress.worker.ts', import.meta.url));
            console.info(`Worker ${i} created`);

            worker.postMessage({
                message: 'start',
                rules: JSON.parse(JSON.stringify(rules.value)),
            } as VanityAddressMessage);

            worker.onmessage = ({data}: { data: VanityAddressMessage }) => {
                if (data.message !== 'result' || results.value.length >= MAX_VANITY_ADDRESS_RESULTS) {
                    return;
                }

                results.value.push({
                    ...data.value,
                    keypair: Keypair.fromSecretKey(base58.decode(data.value.keypair as any)),
                });

                if (results.value.length >= MAX_VANITY_ADDRESS_RESULTS) {
                    stop();
                }
            };

            worker.onerror = (e) => {
                console.error('Worker error: ', e);
                worker?.terminate();

                const index = workers.findIndex(v => v === worker);
                workers.splice(index, 1);

                console.info(`Worker ${index} destroyed`);

                if (workers.length === 0) {
                    isRunning.value = false;
                }
            };

            workers.push(worker);
        }
    }
}

function stop() {
    isRunning.value = false;

    for (let i = 0; i < workers.length; i++) {
        workers[i].terminate();
        console.info(`Worker ${i} destroyed`);
    }

    workers.splice(0, workers.length);
}

function clearResults() {
    results.value.splice(0, results.value.length);
}

function writeToUri() {
    return writeToolParamsIntoUri({
        rules: encodedRules.value === '' ? undefined : encodedRules.value,
    });
}

// WATCHES --------------------------------------------------------------------
watch([encodedRules], () => {
    writeToUri();
});

// HOOKS ----------------------------------------------------------------------
processUriStoreDataOnMounted(async (query) => {
    const queryRules = query.rules;
    if (queryRules) {
        try {
            rules.value = decodeVanityAddressRules(queryRules);
        } catch (e) {
        }
    }

    writeToUri();
});
removeStoreDataFromUriOnUnmounted();

onUnmounted(() => {
    for (const worker of workers) {
        worker.terminate();
    }

    workers.splice(0, workers.length);
});
</script>

<template>
    <div class="q-px-lg q-py-md keypair-generator">
        <p>Introduce the rules the address must match and then click on run. You can stop it at any moment. Finally, any
            found result will be shown in the bottom list.</p>
        <AlertBox type="warning" class="q-my-md">
            <div>This tool will spawn 2 more threads to try to find a keypair that matches the given rules so your
                computer can slow down and consume more power during the process.
            </div>
        </AlertBox>
        <div class="row no-wrap items-center justify-between">
            <h6>Rules</h6>
            <div v-if="canAddRule">
                <q-btn dense
                       unelevated
                       round
                       size="sm"
                       class="rounded-borders"
                       color="positive"
                       @click="addRule"
                       :disable="isRunning">
                    <q-icon name="fa-solid fa-plus" size="14px"/>
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Add rule</q-tooltip>
                </q-btn>
            </div>
        </div>
        <q-separator class="q-mb-md"/>
        <p>The time used to find a match exponentially increases the more characters you add in a
            rule.</p>
        <p>An <b>insensitive</b> rule will ignore the letter casing during comparisons.</p>
        <p class="q-mb-md">The <b>maximum different chars</b> will establish a threshold to match values that differ in
            some letters.</p>
        <div class="q-mb-lg">
            <VanityAddressRuleBox v-for="(rule, i) in rules"
                                  :key="i"
                                  :index="i"
                                  :rule="rule"
                                  class="q-mb-md"
                                  @remove="removeRule"/>
        </div>
        <div class="row no-wrap items-center justify-between">
            <h6>Results {{ results.length }} / {{ MAX_VANITY_ADDRESS_RESULTS }}</h6>
            <div>
                <q-btn dense
                       unelevated
                       size="sm"
                       class="rounded-borders q-mr-md text-bold q-px-sm"
                       color="secondary"
                       text-color="black"
                       :disable="!isRunning && results.length >= MAX_VANITY_ADDRESS_RESULTS"
                       @click="run">
                    <template v-if="isRunning">
                        Stop
                        <q-icon name="fa-solid fa-stop" size="14px" class="q-ml-sm"/>
                    </template>
                    <template v-else>
                        Run
                        <q-icon name="fa-solid fa-play" size="14px" class="q-ml-sm"/>
                    </template>
                </q-btn>
                <q-btn dense
                       unelevated
                       round
                       size="sm"
                       class="rounded-borders"
                       color="negative"
                       @click="clearResults"
                       :disable="results.length === 0">
                    <q-icon name="fa-solid fa-trash" size="14px"/>
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Clear results</q-tooltip>
                </q-btn>
            </div>
        </div>
        <q-separator class="q-mb-md"/>
        <div class="flex flex-center q-mb-lg" v-if="isRunning">
            <q-spinner size="20px"/>
        </div>
        <div v-if="results.length > 0" class="q-mb-lg">
            <VanityAddressResultBox v-for="(result, i) in results"
                                    :key="result.keypair.publicKey.toString()"
                                    :index="i"
                                    :result="result"
                                    class="q-mb-md"/>
        </div>
        <div class="flex flex-center q-mb-lg" v-else>Empty</div>
    </div>
</template>

<style lang="scss" scoped></style>