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
}, {
    id: 'nonceAuthority',
    name: 'Nonce Authority',
    description: 'Account of the current nonce authority',
    signer: true,
    mutable: false,
    data: {
        type: 'address',
    },
}] as const;

const ARGUMENTS = [{
    id: 'newNonceAuthority',
    name: 'New Nonce Authority',
    description: 'Account to set as the new nonce authority',
    data: {
        type: 'address',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramAuthorizeNonceAccountIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_AUTHORIZE_NONCE_ACCOUNT_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'AuthorizeNonceAccount',
    description: 'Change the entity authorized to execute nonce instructions on the account',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.nonceAuthorize({
            noncePubkey: isPubkey(data.nonceAccount) ? data.nonceAccount : data.nonceAccount.publicKey,
            authorizedPubkey: isPubkey(data.nonceAuthority) ? data.nonceAuthority : data.nonceAuthority.publicKey,
            newAuthorizedPubkey: isPubkey(data.newNonceAuthority) ? data.newNonceAuthority :
                data.newNonceAuthority.publicKey,
        });
    },
});