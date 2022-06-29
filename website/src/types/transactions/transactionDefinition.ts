import {ProgramIxnData, ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';
import {PublicKey} from '@solana/web3.js';

export interface TransactionDefinition<Instructions extends ProgramIxnDefinition<any, any>[] = ProgramIxnDefinition<any, any>[], Data extends ProgramIxnData<any, any>[] = ProgramIxnData<any, any>[]> {
    name: string;
    instructions: Instructions;
    data: Data;
    payer: PublicKey;
}