import {SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'nonceAccount',
    name: 'Nonce Account',
    signer: false,
    mutable: true,
    data: {
        type: 'address',
    },
}] as const;

const ARGUMENTS = [{
    id: 'nonceAuthority',
    name: 'Nonce Authority',
    description: 'Account to set as authority of the initialized nonce account',
    data: {
        type: 'address',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramInitializeNonceAccountIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_INITIALIZE_NONCE_ACCOUNT_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'InitializeNonceAccount',
    description: 'Drive state of Uninitialized nonce account to Initialized, setting the nonce value',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.nonceInitialize({
            noncePubkey: isPubkey(data.nonceAccount) ? data.nonceAccount : data.nonceAccount.publicKey,
            authorizedPubkey: isPubkey(data.nonceAuthority) ? data.nonceAuthority : data.nonceAuthority.publicKey,
        });
    },
});