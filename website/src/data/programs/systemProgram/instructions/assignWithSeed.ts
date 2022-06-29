import {SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'assignedAccount',
    name: 'Assigned Account',
    description: 'The account which will be assigned a new owner',
    signer: false,
    mutable: true,
    data: {
        type: 'address',
        autogenerate: true,
    },
}, {
    id: 'baseAccount',
    name: 'Base Account',
    description: 'Account to use to derive the funding account address',
    signer: true,
    mutable: false,
    data: {
        type: 'address',
    },
}] as const;

const ARGUMENTS = [{
    id: 'seed',
    name: 'Seed',
    description: 'Seed to use to derive the address of the assigned account',
    data: {
        type: 'string',
    },
}, {
    id: 'programId',
    name: 'Program',
    description: 'The program to assign as the owner',
    data: {
        type: 'program',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramAssignWithSeedIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_ASSIGN_WITH_SEED_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'AssignWithSeed',
    description: 'Assign an account to a program based on a seed',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.assign({
            accountPubkey: isPubkey(data.assignedAccount) ? data.assignedAccount : data.assignedAccount.publicKey,
            basePubkey: isPubkey(data.baseAccount) ? data.baseAccount : data.baseAccount.publicKey,
            seed: data.seed,
            programId: data.programId,
        });
    },
});