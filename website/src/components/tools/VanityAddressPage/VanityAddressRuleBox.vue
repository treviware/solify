<script lang="ts" setup>
import {useVanityAddressToolStore} from 'stores/tools/vanityAddress';
import {computed} from 'vue';
import {isBase58} from 'src/utils/strings';

const props = defineProps<{
    index: number;
}>();
const emits = defineEmits<{
    (e: 'remove', ruleIndex: number): void,
}>();

const vanityAddressToolStore = useVanityAddressToolStore();

const options = [{
    label: 'Starts with',
    value: 'startsWith',
}, {
    label: 'Ends with',
    value: 'endsWith',
}, {
    label: 'Contains',
    value: 'contains',
}];

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const rule = computed(() => vanityAddressToolStore.rules[props.index]!);

// METHODS --------------------------------------------------------------------
function remove() {
    emits('remove', props.index);
}

function updateText(newText: string) {
    if (!isBase58(newText)) {
        return;
    }

    rule.value.value = newText;

    const newValue = Math.max(0, newText.length - 1);
    if (newValue < rule.value.maxDifferentChars) {
        rule.value.maxDifferentChars = newValue;
    }
}

function updateMaxDifferentChars(chars: string) {
    const charsNum = parseInt(chars);

    if (!isNaN(charsNum)) {
        rule.value.maxDifferentChars = Math.max(0, Math.min(charsNum, rule.value.value.length - 1));
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-card>
        <q-card-section>
            <div class="row no-wrap justify-between items-center">
                <div>Rule {{ index }}</div>
                <div>
                    <q-btn dense unelevated round size="sm" class="rounded-borders" color="negative" @click="remove">
                        <q-icon name="fa-solid fa-trash" size="14px"/>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Remove rule</q-tooltip>
                    </q-btn>
                </div>
            </div>
            <div class="row no-wrap items-center q-mt-md gap-md">
                <q-select v-model="rule.type"
                          dense
                          outlined
                          :options="options"
                          emit-value
                          map-options
                          hide-dropdown-icon
                          class="type-select left-box"/>
                <q-input :model-value="rule.value"
                         outlined
                         dense
                         :debounce="300"
                         class="col"
                         placeholder="Text to find"
                         @update:model-value="updateText"/>
            </div>
            <div class="row no-wrap items-center q-mt-md gap-md">
                <div class="flex flex-center left-box">
                    <q-toggle dense v-model="rule.insensitive" label="Insensitive?" left-label/>
                </div>
                <q-input :model-value="rule.maxDifferentChars.toString()"
                         outlined
                         dense
                         :debounce="300"
                         class="col"
                         label="Maximum different chars"
                         @update:model-value="updateMaxDifferentChars"/>
            </div>
        </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped>
.left-box {
    width: 130px;
}

.type-select:deep(.q-field__native) {
    padding-left: 10px;
    padding-right: 10px;
}
</style>