import {PublicKey, TransactionInstruction} from '@solana/web3.js';
import BN from 'bn.js';
import {FieldsToArray, PartialRecord} from 'src/types/general';

export interface ProgramIxnDefinition<T> {
    name: string;
    description: string;
    arguments: ProgramIxnArgumentDefinition[];
    instantiate: (ixnDefinition: ProgramIxnDefinition<T>) => T;
    update?: (ixnDefinition: ProgramIxnDefinition<T>, data: T,
              field: FieldsToArray<T>) => PartialRecord<keyof T, string>;
    build: (ixnDefinition: ProgramIxnDefinition<T>, data: T) => TransactionInstruction;
}

export function defineInstruction<T>(instruction: ProgramIxnDefinition<T>): ProgramIxnDefinition<T> {
    return instruction;
}

export interface ProgramIxnArgumentDefinition {
    id: string;
    name: string;
    description?: string;
    readonly?: boolean;
    isAccount?: boolean;
    mutable?: boolean;
    signer?: boolean;
    data: ProgramIxnArgumentData;
}

export type ProgramIxnArgumentData =
    ProgramIxnBoolArgument
    | ProgramIxnNumberArgument
    | ProgramIxnBigNumberArgument
    | ProgramIxnBpsArgument
    | ProgramIxnStringArgument
    | ProgramIxnAddressArgument;

export interface ProgramIxnBoolArgument {
    type: 'bool';
    defaultValue?: boolean;
}

export interface ProgramIxnNumberArgument {
    type: 'number';
    defaultValue?: number;
}

export interface ProgramIxnBigNumberArgument {
    type: 'bignum';
    defaultValue?: BN;
}

export interface ProgramIxnBpsArgument {
    type: 'bps';
    defaultValue?: BN;
    tokenAddress: PublicKey;
}

export interface ProgramIxnStringArgument {
    type: 'string';
    defaultValue?: string;
}

export interface ProgramIxnAddressArgument {
    type: 'address';
    defaultValue?: PublicKey;
}