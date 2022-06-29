import {PublicKey, SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'fundingAccount',
    name: 'Funding account',
    description: 'The account that will pay the lamports to fund the new account',
    signer: true,
    mutable: true,
    data: {
        type: 'address',
    },
}, {
    id: 'newAccount',
    name: 'New account',
    description: 'The new account to generate',
    signer: false,
    mutable: true,
    data: {
        type: 'address',
        autogenerate: true,
    },
}, {
    id: 'baseAccount',
    name: 'Base Account',
    description: 'Account to use to derive the address of the created account. Must be the same as the base key used to create \'New account\'',
    signer: true,
    mutable: false,
    data: {
        type: 'address',
    },
}] as const;

const ARGUMENTS = [{
    id: 'lamports',
    name: 'Lamports',
    description: 'Number of lamports to transfer to the new account',
    data: {
        type: 'bps',
        tokenAddress: PublicKey.default,
    },
}, {
    id: 'space',
    name: 'Space',
    description: 'Number of bytes of memory to allocate',
    data: {
        type: 'bytes',
    },
}, {
    id: 'programId',
    name: 'Program',
    description: 'Address of the program that will own the new account',
    data: {
        type: 'program',
    },
}, {
    id: 'seed',
    name: 'Seed',
    description: 'Seed to use to derive the address of the created account. Must be the same as the seed used to create \'New account\'',
    data: {
        type: 'string',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramCreateAccountWithSeedIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_CREATE_ACCOUNT_WITH_SEED_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'CreateAccountWithSeed',
    description: 'Create a new account at an address derived from a base pubkey and a seed',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.createAccountWithSeed({
            fromPubkey: isPubkey(data.fundingAccount) ? data.fundingAccount : data.fundingAccount.publicKey,
            newAccountPubkey: isPubkey(data.newAccount) ? data.newAccount : data.newAccount.publicKey,
            basePubkey: isPubkey(data.baseAccount) ? data.baseAccount : data.baseAccount.publicKey,
            lamports: Number(data.lamports),
            space: data.space,
            programId: data.programId,
            seed: data.seed,
        });
    },
});