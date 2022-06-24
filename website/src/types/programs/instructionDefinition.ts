import {Keypair, PublicKey, TransactionInstruction} from '@solana/web3.js';
import BN from 'bn.js';
import {ArrayIndex, FieldsToArray, PartialRecord} from 'src/types/general';
import {defaultInstantiateSolanaInstruction, defaultUpdateSolanaInstruction} from 'src/data/programs';

export interface ProgramIxnDefinition<Args extends ProgramIxnArgumentDefinition[]> {
    name: string;
    description: string;
    arguments: Args;
    instantiate: (ixnDefinition: ProgramIxnDefinition<Args>) => ProgramIxnData<Args>;
    update: (ixnDefinition: ProgramIxnDefinition<Args>, data: ProgramIxnData<Args>,
             field: FieldsToArray<ProgramIxnData<Args>>) => PartialRecord<keyof ProgramIxnData<Args>, string>;
    build: (ixnDefinition: ProgramIxnDefinition<Args>, data: ProgramIxnData<Args>) => TransactionInstruction;
}

export interface ProgramIxnDefinitionBuilder<Args extends ProgramIxnArgumentDefinition[]> {
    name: string;
    description: string;
    arguments: Args;
    instantiate?: (ixnDefinition: ProgramIxnDefinition<Args>) => ProgramIxnData<Args>;
    update?: (ixnDefinition: ProgramIxnDefinition<Args>, data: ProgramIxnData<Args>,
              field: FieldsToArray<ProgramIxnData<Args>>) => PartialRecord<keyof ProgramIxnData<Args>, string>;
    build: (ixnDefinition: ProgramIxnDefinition<Args>, data: ProgramIxnData<Args>) => TransactionInstruction;
}

export function defineInstruction<Args extends ProgramIxnArgumentDefinition[]>(instruction: ProgramIxnDefinitionBuilder<Args>): ProgramIxnDefinition<Args> {
    if (!instruction.instantiate) {
        instruction.instantiate = defaultInstantiateSolanaInstruction;
    }

    if (!instruction.instantiate) {
        instruction.instantiate = defaultUpdateSolanaInstruction as any;
    }

    return instruction as any;
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
    | ProgramIxnProgramArgument
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

export interface ProgramIxnProgramArgument {
    type: 'program';
    defaultValue?: PublicKey;
}

export interface ProgramIxnAddressArgument {
    type: 'address';
    defaultValue?: PublicKey | Keypair;

    /**
     * Whether to auto generate the initial value or not.
     */
    autogenerate?: boolean;
}

// ----------------------------------------------------------------------------
// Type guessing --------------------------------------------------------------
// ----------------------------------------------------------------------------
export type ProgramIxnData<T extends ProgramIxnArgumentDefinition[]> = {
    [P in ArrayIndex<T> as T[P]['id']]: FilterProgramIxnType<T[P]['data']>;
};
export type FilterProgramIxnType<T extends ProgramIxnArgumentData, D = T['type']> = D extends 'bool' ? boolean : D extends 'number' ? number : D extends 'bignum' | 'bps' ? BN : D extends 'string' ? string : D extends 'program' ? PublicKey : D extends 'address' ? PublicKey | Keypair : never;