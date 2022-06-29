<script lang="ts" setup>
import {ProgramAccountTypeDefinition} from 'src/types/programs/accountDefinition';
import ProgramAccountStructTypeField from 'components/apps/ProgramExplorerPage/ProgramAccountStructTypeField.vue';
import ProgramAccountEnumTypeVariant from 'components/apps/ProgramExplorerPage/ProgramAccountEnumTypeVariant.vue';

defineProps<{
    type: ProgramAccountTypeDefinition; index: number;
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="row items-start gap-md">
        <h6>#{{ index + 1 }}</h6>
        <q-card class="col">
            <q-card-section>
                <div class="code">
                    <p v-if="type.description"><span class="comment doc">/// {{ type.description }}</span></p>
                    <p><span class="keyword">{{ type.type.type }}</span> <span class="type">{{ type.name }}</span> {</p>
                    <template v-if="type.type.type === 'struct'">
                        <template v-if="type.type.fields.length > 0">
                            <ProgramAccountStructTypeField :field="field"
                                                           v-for="(field, i) in type.type.fields"
                                                           class="q-pl-md"
                                                           :class="{'q-mt-sm': i > 0}"
                                                           :key="field.id"/>
                        </template>
                        <p v-else class="q-pl-md"><span class="comment">// Empty</span></p>
                    </template>
                    <template v-else>
                        <template v-if="type.type.variants.length > 0">
                            <ProgramAccountEnumTypeVariant :variant="variant"
                                                           v-for="(variant, i) in type.type.variants"
                                                           class="q-pl-md"
                                                           :class="{'q-mt-sm': i > 0}"
                                                           :key="variant.id"/>
                        </template>
                        <p v-else class="q-pl-md"><span class="comment">// Empty</span></p>
                    </template>
                    <p>}</p>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<style lang="scss" scoped>
.title {
    font-size: 1.1rem;
    font-weight: 500;
}

.code {
    font-family: Inconsolata, monospace;

    &:deep(span.name) {
        font-weight: $accent;
    }

    &:deep(span.type) {
        font-weight: bold;
    }

    &:deep(span.keyword) {
        color: $secondary;
    }

    &:deep(span.comment) {
        color: $grey-6;
    }

    &:deep(span.comment.doc) {
        color: $primary;
    }
}
</style>