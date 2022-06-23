import {PublicKey, SystemProgram} from '@solana/web3.js';
import BN from 'bn.js';
import {FEE_AMOUNT_PER_TRANSACTION, FEE_WALLET} from 'src/constants';
import {defineInstruction} from 'src/types/programs/instructionDefinition';
import {defaultCreateSolanaInstruction} from 'src/data/programs';

export interface SolifyFeeInstructionArgs {
    source: PublicKey;
    destination: PublicKey;
    lamports: BN;
}

export const SOLIFY_FEE_INSTRUCTION = defineInstruction<SolifyFeeInstructionArgs>({
    name: 'Solify Fee',
    description: 'Instruction to charge users with a fee when sending a transaction with Solify.',
    arguments: [{
        id: 'source',
        name: 'Fee payer account',
        description: 'The account that will pay the fee.',
        isAccount: true,
        data: {
            type: 'address',
        },
    }, {
        id: 'destination',
        name: 'Fee account',
        description: 'The account that will receive the fee.',
        readonly: true,
        isAccount: true,
        data: {
            type: 'address',
            defaultValue: FEE_WALLET,
        },
    }, {
        id: 'lamports',
        name: 'Fee amount',
        description: 'The amount of lamports to charge as fee.',
        readonly: true,
        data: {
            type: 'bps',
            defaultValue: FEE_AMOUNT_PER_TRANSACTION,
            tokenAddress: PublicKey.default,
        },
    }],

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    instantiate(ixnDefinition) {
        const data = defaultCreateSolanaInstruction(ixnDefinition);
        data.lamports = FEE_AMOUNT_PER_TRANSACTION;

        return data;
    },
    update(ixnDefinition, data, field) {
        data[field.fieldName] = field.value as any;

        // No error messages.
        return {};
    },
    build(ixnDefinition, data) {
        return SystemProgram.transfer({
            fromPubkey: data.source,
            toPubkey: FEE_WALLET,
            lamports: BigInt(FEE_AMOUNT_PER_TRANSACTION.toString()),
        });
    },
});