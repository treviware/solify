import {defineProgram} from 'src/types/programs/programDefinition';
import {PublicKey} from '@solana/web3.js';
import {SYSTEM_PROGRAM_CREATE_ACCOUNT_INSTRUCTION} from 'src/data/programs/systemProgram/instructions/createAccount';
import {SYSTEM_PROGRAM_TRANSFER_INSTRUCTION} from 'src/data/programs/systemProgram/instructions/transfer';
import {SYSTEM_PROGRAM_ASSIGN_INSTRUCTION} from 'src/data/programs/systemProgram/instructions/assign';
import {SYSTEM_PROGRAM_ALLOCATE_INSTRUCTION} from 'src/data/programs/systemProgram/instructions/allocate';
import {
    SYSTEM_PROGRAM_TRANSFER_WITH_SEED_INSTRUCTION,
} from 'src/data/programs/systemProgram/instructions/transferWithSeed';
import {SYSTEM_PROGRAM_ASSIGN_WITH_SEED_INSTRUCTION} from 'src/data/programs/systemProgram/instructions/assignWithSeed';
import {
    SYSTEM_PROGRAM_ALLOCATE_WITH_SEED_INSTRUCTION,
} from 'src/data/programs/systemProgram/instructions/allocateWithSeed';
import {
    SYSTEM_PROGRAM_CREATE_ACCOUNT_WITH_SEED_INSTRUCTION,
} from 'src/data/programs/systemProgram/instructions/createAccountWithSeed';
import {
    SYSTEM_PROGRAM_ADVANCE_NONCE_ACCOUNT_INSTRUCTION,
} from 'src/data/programs/systemProgram/instructions/advanceNonceAccount';
import {
    SYSTEM_PROGRAM_WITHDRAW_NONCE_ACCOUNT_INSTRUCTION,
} from 'src/data/programs/systemProgram/instructions/withdrawNonceAccount';
import {
    SYSTEM_PROGRAM_INITIALIZE_NONCE_ACCOUNT_INSTRUCTION,
} from 'src/data/programs/systemProgram/instructions/initializeNonceAccount';
import {
    SYSTEM_PROGRAM_AUTHORIZE_NONCE_ACCOUNT_INSTRUCTION,
} from 'src/data/programs/systemProgram/instructions/authorizeNonceAccount';
import {SYSTEM_PROGRAM_ACCOUNTS} from 'src/data/programs/systemProgram/accounts';

export const SYSTEM_PROGRAM = defineProgram({
    address: PublicKey.default,
    name: 'System Program',
    icon: '/logos/solana.png',
    description: 'The basic instructions supported in the Solana network',
    accounts: SYSTEM_PROGRAM_ACCOUNTS,
    instructions: [SYSTEM_PROGRAM_CREATE_ACCOUNT_INSTRUCTION, SYSTEM_PROGRAM_CREATE_ACCOUNT_WITH_SEED_INSTRUCTION,
        SYSTEM_PROGRAM_ASSIGN_INSTRUCTION, SYSTEM_PROGRAM_ASSIGN_WITH_SEED_INSTRUCTION,
        SYSTEM_PROGRAM_TRANSFER_INSTRUCTION, SYSTEM_PROGRAM_TRANSFER_WITH_SEED_INSTRUCTION,
        SYSTEM_PROGRAM_ALLOCATE_INSTRUCTION, SYSTEM_PROGRAM_ALLOCATE_WITH_SEED_INSTRUCTION,
        SYSTEM_PROGRAM_ADVANCE_NONCE_ACCOUNT_INSTRUCTION, SYSTEM_PROGRAM_WITHDRAW_NONCE_ACCOUNT_INSTRUCTION,
        SYSTEM_PROGRAM_INITIALIZE_NONCE_ACCOUNT_INSTRUCTION, SYSTEM_PROGRAM_AUTHORIZE_NONCE_ACCOUNT_INSTRUCTION],
    pdas: [],
});