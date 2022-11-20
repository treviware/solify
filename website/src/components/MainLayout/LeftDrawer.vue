<script lang="ts" setup>
import LeftDrawerMenuButton from 'components/MainLayout/LeftDrawerMenuButton.vue';
import {useMenuStore} from 'stores/menu';
import {SOCIAL_LINKS} from 'src/constants/social';
import {MENU_BUTTONS} from 'src/constants/menu';
import {computed} from 'vue';

const menuStore = useMenuStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const menuButtons = computed(() => MENU_BUTTONS.map(b => {
    let obj = {...b};
    delete obj.children;

    return obj;
}));

// METHODS --------------------------------------------------------------------
function openLink(link: string) {
    window.open(link, '_blank');
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="full-width full-height column left-drawer no-wrap">
        <div class="row justify-center items-center logo-container">
            <img src="/logos/Logo.png"/>
            <div class="text-bold q-ml-md text-h6">
                <div class="relative-position" style="top:5px">Solify</div>
                <div class="text-caption text-bold relative-position" style="bottom:5px">by
                    <a class="text-secondary" target="_blank">Treviware</a>
                </div>
            </div>
        </div>
        <div class="menu column q-py-md" style="gap: 6px">
            <q-space/>
            <q-list>
                <LeftDrawerMenuButton v-bind="button"
                                      v-for="button in menuButtons"
                                      :key="button.name"></LeftDrawerMenuButton>
            </q-list>
            <q-space/>
            <div class="text-primary text-caption text-bold text-center q-mt-md">Recent tools</div>
            <q-separator/>
            <q-list>
                <LeftDrawerMenuButton v-bind="button"
                                      v-for="(button, i) in menuStore.recentMenuTools"
                                      :index="i"
                                      :key="button.name"></LeftDrawerMenuButton>
                <q-separator/>
                <q-item class="row flex-center gap-sm">
                    <q-btn v-for="link in SOCIAL_LINKS"
                           flat
                           round
                           size="sm"
                           class="rounded-borders"
                           :key="link.network"
                           @click="openLink(link.url)">
                        <q-icon :name="link.icon"/>
                    </q-btn>
                </q-item>
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