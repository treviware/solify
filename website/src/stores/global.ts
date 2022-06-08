import {defineStore} from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    }),
});