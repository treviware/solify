import {PublicKey} from '@solana/web3.js';
import BN from 'bn.js';
import {SOLIFY_PROGRAM} from 'src/data/programs/solify';
import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';

export const SOLANA_PROGRAMS = [SOLIFY_PROGRAM];

export function defaultCreateSolanaInstruction(ixnDefinition: ProgramIxnDefinition<any>): any {
    const result: Record<string, any> = {};

    for (const argument of ixnDefinition.arguments) {
        switch (argument.data.type) {
            case 'bool':
                result[argument.id] = argument.data.defaultValue ?? false;
                break;
            case 'number':
                result[argument.id] = argument.data.defaultValue ?? 0;
                break;
            case 'bignum':
            case 'bps':
                result[argument.id] = argument.data.defaultValue ?? new BN(0);
                break;
            case 'string':
                result[argument.id] = argument.data.defaultValue ?? '';
                break;
            case 'address':
                result[argument.id] = argument.data.defaultValue ?? PublicKey.default;
                break;
        }
    }

    return result;
}