import {SOLIFY_FEE_INSTRUCTION} from 'src/data/programs/solify/fee';
import {defineProgram} from 'src/types/programs/programDefinition';
import {SOLIFY_PROGRAM_ADDRESS} from 'src/constants';

export const SOLIFY_PROGRAM = defineProgram({
    address: SOLIFY_PROGRAM_ADDRESS,
    name: 'Solify',
    icon: '/logos/Logo.png',
    description: 'The instructions associated with the Solify dapp.',
    accounts: [],
    instructions: [SOLIFY_FEE_INSTRUCTION],
    pdas: [],
});