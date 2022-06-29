import {PublicKey, SystemProgram} from '@solana/web3.js';
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
},{
    id: 'recipientAccount',
    name: 'Recipient Account',
    description: 'The account which will receive the withdrawn nonce account balance',
    signer: false,
    mutable: true,
    data: {
        type: 'address',
    },
}, {
    id: 'nonceAuthority',
    name: 'Nonce Authority',
    description: 'The account that is authorized to withdraw the nonce',
    signer: true,
    mutable: false,
    data: {
        type: 'address',
    },
}] as const;

const ARGUMENTS = [{
    id: 'lamports',
    name: 'Lamports',
    description: 'Amount of lamports to withdraw from the nonce account',
    data: {
        type: 'bps',
        tokenAddress: PublicKey.default,
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramWithdrawNonceAccountIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_WITHDRAW_NONCE_ACCOUNT_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'WithdrawNonceAccount',
    description: 'Withdraw funds from a nonce account',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.nonceWithdraw({
            noncePubkey: isPubkey(data.nonceAccount) ? data.nonceAccount : data.nonceAccount.publicKey,
            toPubkey: isPubkey(data.recipientAccount) ? data.recipientAccount : data.recipientAccount.publicKey,
            authorizedPubkey: isPubkey(data.nonceAuthority) ? data.nonceAuthority : data.nonceAuthority.publicKey,
            lamports: Number(data.lamports)
        });
    },
});