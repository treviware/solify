<script lang="ts" setup>
// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input v-bind="$attrs" outlined dense rounded class="searchbar">
        <template v-slot:prepend>
            <q-icon name="fa-solid fa-search" color="grey-8" size="16px"/>
        </template>
    </q-input>
</template>

<style lang="scss" scoped>
.searchbar {
    &:deep(.q-field__control) {
        padding-right: 16px;
        height: 36px;
    }
}
</style>