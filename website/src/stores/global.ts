import {defineStore} from 'pinia';
import {useRoute} from 'vue-router';
import {APP_BUTTONS} from 'src/constants/apps';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    }),
    getters: {
        currentAppButton: () => {
            const route = useRoute();
            return APP_BUTTONS.find(b => route.name === b.pathName);
        },
    },
});