import {PublicKey, SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'fundingAccount',
    name: 'Funding account',
    description: 'The account that will pay the lamports to fund the new account',
    isAccount: true,
    signer: true,
    mutable: true,
    data: {
        type: 'address',
    },
}, {
    id: 'newAccount',
    name: 'New account',
    description: 'The new account to generate',
    isAccount: true,
    signer: true,
    mutable: true,
    data: {
        type: 'address',
        autogenerate: true,
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
        type: 'number',
        min: 0,
    },
}, {
    id: 'programId',
    name: 'Program',
    description: 'Address of the program that will own the new account',
    data: {
        type: 'program',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramCreateAccountIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_CREATE_ACCOUNT_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'Create Account',
    description: 'Create a new account',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.createAccount({
            fromPubkey: isPubkey(data.fundingAccount) ? data.fundingAccount : data.fundingAccount.publicKey,
            newAccountPubkey: isPubkey(data.newAccount) ? data.newAccount : data.newAccount.publicKey,
            lamports: Number(data.lamports),
            space: data.space,
            programId: data.programId,
        });
    },
});