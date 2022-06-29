import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';
import {ProgramAccountsDefinition} from 'src/types/programs/accountDefinition';
import {PdaDefinition} from 'src/types/programs/pdaDefinition';
import {PublicKey} from '@solana/web3.js';

export interface ProgramDefinition<Accounts extends ProgramAccountsDefinition<any, any, any>, Instructions extends ProgramIxnDefinition<any, any>[]> {
    address: PublicKey;
    name: string;
    icon?: string;
    description?: string;
    accounts: Accounts;
    instructions: Instructions;
    pdas: PdaDefinition[];
}

export function defineProgram<Accounts extends ProgramAccountsDefinition<any, any, any>, Instructions extends ProgramIxnDefinition<any, any>[]>(program: ProgramDefinition<Accounts, Instructions>): ProgramDefinition<Accounts, Instructions> {
    return program;
}