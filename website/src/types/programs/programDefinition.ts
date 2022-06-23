import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';
import {ProgramAccountDefinition} from 'src/types/programs/accountDefinition';
import {PdaDefinition} from 'src/types/programs/pdaDefinition';
import {PublicKey} from '@solana/web3.js';

export interface ProgramDefinition<Accounts extends ProgramAccountDefinition<any, any>[], Instructions> {
    address: PublicKey;
    name: string;
    icon?: string;
    description?: string;
    accounts: Accounts;
    instructions: ProgramIxnDefinition<Instructions>[];
    pdas: PdaDefinition[];
}

export function defineProgram<Accounts extends ProgramAccountDefinition<any, any>[], Instructions>(program: ProgramDefinition<Accounts, Instructions>): ProgramDefinition<Accounts, Instructions> {
    return program;
}