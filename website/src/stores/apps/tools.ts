import {defineStore} from 'pinia';

export const useToolsAppStore = defineStore('toolsApp', {
    state: () => ({
        search: '',
    }),
});