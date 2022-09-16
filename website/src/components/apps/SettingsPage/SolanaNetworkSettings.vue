<script lang="ts" setup>
import {useSolanaStore} from 'stores/solana';
import {computed, ref} from 'vue';
import {clusterApiUrl, Connection} from '@solana/web3.js';
import {storeToRefs} from 'pinia';
import {useQuasar} from 'quasar';

const quasar = useQuasar();
const solanaStore = useSolanaStore();

const buttons = [{
    url: clusterApiUrl('mainnet-beta'),
    name: 'Mainnet-beta',
}, {
    url: clusterApiUrl('devnet'),
    name: 'Devnet',
}, {
    url: clusterApiUrl('testnet'),
    name: 'Testnet',
}, {
    url: 'http://localhost:8899',
    name: 'Localnet',
}];

// REFS -----------------------------------------------------------------------
const {extraNetworks} = storeToRefs(solanaStore);
const newRpcNameModified = ref(false);
const newRpcName = ref('');
const newRpcUrlModified = ref(false);
const newRpcUrl = ref('');
const showNewRpcDialog = ref(false);

// COMPUTED -------------------------------------------------------------------
const newNameError = computed(() => {
    if (!newRpcNameModified.value) {
        return null;
    }

    if (newRpcName.value === '') {
        return 'Name is required';
    }

    if (buttons.some(b => b.name === newRpcName.value) || extraNetworks.value.some(n => n.name === newRpcName.value)) {
        return 'Name already exists';
    }

    return null;
});
const newUrlError = computed(() => {
    if (!newRpcUrlModified.value) {
        return null;
    }

    if (newRpcUrl.value === '') {
        return 'Url is required';
    }

    if (buttons.some(b => b.url === newRpcUrl.value) || extraNetworks.value.some(n => n.url === newRpcUrl.value)) {
        return 'Url already exists';
    }

    return null;
});
const canAdd = computed(
    () => newRpcNameModified.value && newRpcUrlModified.value && !newNameError.value && !newUrlError.value);

// METHODS --------------------------------------------------------------------
function select(url: string) {
    solanaStore.setNetwork(url);
}

function add() {
    try {
        new Connection(newRpcUrl.value);
    } catch (e) {
        quasar.notify({
            color: 'negative',
            message: 'Invalid RPC URL',
        });
        return;
    }

    extraNetworks.value.push({
        name: newRpcName.value,
        url: newRpcUrl.value,
    });

    solanaStore.setNetwork(newRpcUrl.value);
    closeDialog();
}

function remove(index: number) {
    let [el] = extraNetworks.value.splice(index, 1);

    if (el.url === solanaStore.network) {
        solanaStore.setNetwork(clusterApiUrl('mainnet-beta'));
    }
}

function closeDialog() {
    newRpcName.value = '';
    newRpcNameModified.value = false;
    newRpcUrl.value = '';
    newRpcUrlModified.value = false;
    showNewRpcDialog.value = false;
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <h6>Solana RPC Endpoint</h6>
        <p>The RPC endpoint used to communicate with the network:</p>
        <div class="flex flex-center q-my-md gap-md">
            <q-card>
                <q-card-section>
                    <q-list dense>
                        <q-item v-for="button in buttons" :key="button.name">
                            <q-item-section avatar>
                                <q-radio dense
                                         :model-value="solanaStore.network"
                                         :val="button.url"
                                         @click="select(button.url)"/>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label><span class="text-secondary">{{ button.name }}</span>: {{ button.url }}
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item v-for="(button, index) in extraNetworks" :key="button.name">
                            <q-item-section avatar>
                                <q-radio dense
                                         :model-value="solanaStore.network"
                                         :val="button.url"
                                         @click="select(button.url)"/>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label><span class="text-secondary">{{ button.name }}</span>: {{ button.url }}
                                </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-btn color="negative" flat dense @click="remove(index)" round class="rounded-borders">
                                    <q-icon name="fa-solid fa-trash" size="20px"/>
                                </q-btn>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
                <q-card-actions align="center">
                    <q-btn color="primary" label="Add new RPC endpoint" @click="showNewRpcDialog = true"/>
                </q-card-actions>
            </q-card>
        </div>
        <q-dialog v-model="showNewRpcDialog" @hide="closeDialog">
            <q-card class="dialog-card">
                <q-card-section>
                    <h6 class="text-secondary text-caption text-bold">RPC name</h6>
                    <q-input v-model="newRpcName"
                             outlined
                             dense
                             :error="!!newNameError"
                             :error-message="newNameError"
                             @update:model-value="newRpcNameModified = true"
                             no-error-icon>
                        <template v-slot:append>
                            <q-icon v-if="newNameError"
                                    name="fa-solid fa-triangle-exclamation"
                                    color="negative"
                                    size="xs"></q-icon>
                        </template>
                    </q-input>
                    <h6 class="text-secondary text-caption text-bold q-mt-md">RPC endpoint</h6>
                    <q-input v-model="newRpcUrl"
                             outlined
                             dense
                             :error="!!newUrlError"
                             :error-message="newUrlError"
                             @update:model-value="newRpcUrlModified = true"
                             no-error-icon>
                        <template v-slot:append>
                            <q-icon v-if="newUrlError"
                                    name="fa-solid fa-triangle-exclamation"
                                    color="negative"
                                    size="xs"></q-icon>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" @click="showNewRpcDialog = false"/>
                    <q-btn :disable="!canAdd" color="primary" label="Add" @click="add"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style lang="scss" scoped>
.header {
  height: 80px;
  border-bottom: 2px solid $dark;
}

.dialog-card {
  width: 500px;
  max-width: 100%;
}
</style>