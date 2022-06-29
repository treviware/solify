import {PublicKey, SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'fundingAccount',
    name: 'Funding account',
    description: 'Account that will transfer lamports',
    signer: false,
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
    id: 'lamports',
    name: 'Lamports',
    description: 'Number of lamports to transfer',
    data: {
        type: 'bps',
        tokenAddress: PublicKey.default,
    },
}, {
    id: 'seed',
    name: 'Seed',
    description: 'Seed to use to derive the funding account address',
    data: {
        type: 'string',
    },
}, {
    id: 'programId',
    name: 'Program',
    description: 'Program id to use to derive the funding account address',
    data: {
        type: 'program',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramTransferWithSeedIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_TRANSFER_WITH_SEED_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'TransferWithSeed',
    description: 'Transfer lamports from a derived address',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.transfer({
            fromPubkey: isPubkey(data.fundingAccount) ? data.fundingAccount : data.fundingAccount.publicKey,
            toPubkey: isPubkey(data.recipientAccount) ? data.recipientAccount : data.recipientAccount.publicKey,
            basePubkey: isPubkey(data.baseAccount) ? data.baseAccount : data.baseAccount.publicKey,
            lamports: BigInt(data.lamports.toString()),
            seed: data.seed,
            programId: data.programId,
        });
    },
});