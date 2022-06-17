<script lang="ts" setup>
import LeftDrawerMenuButton from 'components/MainLayout/LeftDrawerMenuButton.vue';
import {APP_BUTTONS} from 'src/constants/apps';
import {UTILITY_BUTTONS} from 'src/constants/utilites';

const appButtons = APP_BUTTONS;
const utilityButtons = UTILITY_BUTTONS;

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="full-width full-height column left-drawer">
        <div class="row justify-center items-center logo-container">
            <img src="/logos/Logo.png"/>
            <div class="text-bold q-ml-md text-h6">
                <div class="relative-position" style="top:5px">Solify</div>
                <div class="text-caption text-bold relative-position" style="bottom:5px">by
                    <a class="text-secondary" href="https://treviware.com" target="_blank">Treviware</a>
                </div>
            </div>
        </div>
        <div class="menu column q-py-md" style="gap: 6px">
            <q-space/>
            <q-list>
                <LeftDrawerMenuButton v-bind="button"
                                      v-for="button in appButtons"
                                      :key="button.name"></LeftDrawerMenuButton>
            </q-list>
            <q-space/>
            <div class="text-primary text-caption text-bold text-center q-mt-md">Recent utilities</div>
            <q-separator/>
            <q-list>
                <LeftDrawerMenuButton v-bind="button"
                                      v-for="button in utilityButtons"
                                      :key="button.name"></LeftDrawerMenuButton>
            </q-list>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.left-drawer {
    background-color: $dark2;

    .logo-container {
        height: 80px;

        img {
            height: 50px;
            width: 50px;
        }
    }

    .menu {
        flex-grow: 1;
    }
}
</style>