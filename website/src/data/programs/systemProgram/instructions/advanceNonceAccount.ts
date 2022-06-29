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
    description: 'The account that is authorized to advance the nonce',
    signer: true,
    mutable: false,
    data: {
        type: 'address',
    },
}] as const;

const ARGUMENTS = [] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramAdvanceNonceAccountIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_ADVANCE_NONCE_ACCOUNT_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'AdvanceNonceAccount',
    description: 'Consumes a stored nonce, replacing it with a successor',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.nonceAdvance({
            noncePubkey: isPubkey(data.nonceAccount) ? data.nonceAccount : data.nonceAccount.publicKey,
            authorizedPubkey: isPubkey(data.nonceAuthority) ? data.nonceAuthority : data.nonceAuthority.publicKey,
        });
    },
});