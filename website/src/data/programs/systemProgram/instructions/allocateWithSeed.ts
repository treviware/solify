import {SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'account',
    name: 'Account',
    description: 'The account to allocate',
    signer: false,
    mutable: true,
    data: {
        type: 'address',
        autogenerate: true,
    },
}, {
    id: 'baseAccount',
    name: 'Base Account',
    description: 'Account to use to derive the address of the allocated account',
    signer: true,
    mutable: false,
    data: {
        type: 'address',
    },
}] as const;

const ARGUMENTS = [{
    id: 'space',
    name: 'Space',
    description: 'Number of bytes of memory to allocate',
    data: {
        type: 'bytes',
    },
}, {
    id: 'seed',
    name: 'Seed',
    description: 'Seed to use to derive the address of the allocated account',
    data: {
        type: 'string',
    },
}, {
    id: 'programId',
    name: 'Program',
    description: 'The program to assign as the owner of the allocated account',
    data: {
        type: 'program',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramAllocateWithSeedIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_ALLOCATE_WITH_SEED_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'AllocateWithSeed',
    description: 'Allocate space for and assign an account at an address derived from a base public key and a seed',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.allocate({
            accountPubkey: isPubkey(data.account) ? data.account : data.account.publicKey,
            basePubkey: isPubkey(data.baseAccount) ? data.baseAccount : data.baseAccount.publicKey,
            space: data.space,
            seed: data.seed,
            programId: data.programId,
        });
    },
});