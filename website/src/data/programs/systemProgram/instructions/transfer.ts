import {PublicKey, SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'fundingAccount',
    name: 'Funding account',
    description: 'Account that will transfer lamports',
    signer: true,
    mutable: true,
    data: {
        type: 'address',
    },
}, {
    id: 'recipientAccount',
    name: 'Recipient Account',
    description: 'Account that will receive transferred lamports',
    signer: false,
    mutable: true,
    data: {
        type: 'address',
    },
}] as const;

const ARGUMENTS = [{
    id: 'lamports',
    name: 'Lamports',
    description: 'Number of lamports to transfer',
    data: {
        type: 'bps',
        tokenAddress: PublicKey.default,
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramTransferIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_TRANSFER_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'Transfer',
    description: 'Transfer lamports',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.transfer({
            fromPubkey: isPubkey(data.fundingAccount) ? data.fundingAccount : data.fundingAccount.publicKey,
            toPubkey: isPubkey(data.recipientAccount) ? data.recipientAccount : data.recipientAccount.publicKey,
            lamports: BigInt(data.lamports.toString()),
        });
    },
});