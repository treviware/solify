import {defineStore} from 'pinia';
import {SOLANA_PROGRAMS} from 'src/data/programs';

export const useProgramExplorerAppStore = defineStore('programExplorerApp', {
    state: () => ({
        programs: [...SOLANA_PROGRAMS],
        search: '',
    }),
});