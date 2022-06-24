import {defineProgram} from 'src/types/programs/programDefinition';
import {PublicKey} from '@solana/web3.js';
import {SYSTEM_PROGRAM_CREATE_ACCOUNT_INSTRUCTION} from 'src/data/programs/systemProgram/instructions/createAccount';
import {SYSTEM_PROGRAM_WALLET_ACCOUNT} from 'src/data/programs/systemProgram/accounts/wallet';

export const SYSTEM_PROGRAM = defineProgram({
    address: PublicKey.default,
    name: 'System Program',
    icon: '/logos/solana.png',
    description: 'The basic instructions supported in the Solana network',
    accounts: [SYSTEM_PROGRAM_WALLET_ACCOUNT],
    instructions: [SYSTEM_PROGRAM_CREATE_ACCOUNT_INSTRUCTION],
    pdas: [],
});