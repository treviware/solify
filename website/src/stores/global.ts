import {defineStore} from 'pinia';
import {useRoute} from 'vue-router';
import {APP_BUTTONS} from 'src/constants/apps';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    }),
    getters: {
        isMobile: (state) => state.windowWidth <= 600,
        currentAppButton: () => {
            const route = useRoute();
            return APP_BUTTONS.find(b => route.name === b.pathName) ??
                APP_BUTTONS.find(b => b.pathAlias && b.pathAlias.some(v => v === route.name));
        },
    },
});