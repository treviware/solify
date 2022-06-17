<script lang="ts" setup>
import {computed, ref} from 'vue';
import SearchBar from 'components/general/SearchBar.vue';
import {UTILITY_BUTTONS_BY_CATEGORY} from 'src/constants/utilites';
import {UtilityCategory} from 'src/types/utilities';
import UtilityCard from 'components/apps/UtilitiesPage/UtilityCard.vue';

// REFS -----------------------------------------------------------------------
const search = ref('');

// COMPUTED -------------------------------------------------------------------
const filteredCategories = computed(() => UTILITY_BUTTONS_BY_CATEGORY.map(v => {
    if (search.value === '') {
        return {
            ...v,
            buttons: v.buttons.map(b => ({...b})),
        };
    }

    const buttons = v.buttons.filter(
        b => b.name.toLowerCase().indexOf(search.value) >= 0 || b.description.toLowerCase().indexOf(search.value) >= 0);

    if (buttons.length === 0) {
        return null;
    }

    return {
        ...v,
        buttons,
    };
}).filter(v => v !== null) as UtilityCategory[]);

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-page class="q-pa-lg">
        <div class="viewport-width">
            <div class="row justify-between items-end q-mb-xl">
                <h3>Utilities</h3>
                <SearchBar v-model="search" placeholder="Search utility" :debounce="300"/>
            </div>
            <div v-for="category in filteredCategories" :key="category.name">
                <h6 class="q-mt-xl">{{ category.name }}</h6>
                <q-separator class="q-mt-sm q-mb-md"/>
                <div class="row justify-start items-stretch gap-md">
                    <UtilityCard v-for="button in category.buttons" :key="button.name" :button="button"></UtilityCard>
                </div>
            </div>
        </div>
    </q-page>
</template>

<style lang="scss" scoped>
.searchbar {
    width: 400px;
}

.menu-card {
    width: 300px;
    max-width: 80vw;

    .title {
        font-size: 20px;
    }

    &:hover::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
    }
}
</style>