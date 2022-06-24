import {PublicKey, SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';
import {FEE_AMOUNT_PER_TRANSACTION, FEE_WALLET} from 'src/constants';

const ARGUMENTS = [{
    id: 'source',
    name: 'Fee payer account',
    description: 'The account that will pay the fee',
    isAccount: true,
    data: {
        type: 'address',
    },
}, {
    id: 'destination',
    name: 'Fee account',
    description: 'The account that will receive the fee',
    readonly: true,
    isAccount: true,
    data: {
        type: 'address',
        defaultValue: FEE_WALLET,
    },
}, {
    id: 'lamports',
    name: 'Fee amount',
    description: 'The amount of lamports to charge as fee',
    readonly: true,
    data: {
        type: 'bps',
        defaultValue: FEE_AMOUNT_PER_TRANSACTION,
        tokenAddress: PublicKey.default,
    },
}] as const;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SolifyProgramFeeIxnArgs = ProgramIxnData<ArgumentsType>
export const SOLIFY_PROGRAM_FEE_INSTRUCTION = defineInstruction<ArgumentsType>({
    name: 'Solify Fee',
    description: 'Instruction to charge users with a fee when sending a transaction with Solify',
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.transfer({
            fromPubkey: isPubkey(data.source) ? data.source : data.source.publicKey,
            toPubkey: isPubkey(data.destination) ? data.destination : data.destination.publicKey,
            lamports: Number(data.lamports),
        });
    },
});