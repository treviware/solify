import {defineStore} from 'pinia';

export const useSignMessageToolStore = defineStore('signMessageTool', {
    state: () => ({
        message: '',
    }),
});