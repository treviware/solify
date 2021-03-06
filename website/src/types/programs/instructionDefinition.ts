import {Keypair, PublicKey, TransactionInstruction} from '@solana/web3.js';
import BN from 'bn.js';
import {ArrayIndex, FieldsToArray, PartialRecord, PartialRecordKeys} from 'src/types/general';

export interface ProgramIxnDefinition<Accounts extends ProgramIxnAccountDefinition[], Args extends ProgramIxnArgumentDefinition[]> {
    name: string;
    description: string;
    accounts: Accounts;
    arguments: Args;
    instantiate: (ixnDefinition: ProgramIxnDefinition<Accounts, Args>) => ProgramIxnData<Accounts, Args>;
    update: (ixnDefinition: ProgramIxnDefinition<Accounts, Args>, data: ProgramIxnData<Accounts, Args>,
             field: FieldsToArray<ProgramIxnData<Accounts, Args>>) => PartialRecord<keyof ProgramIxnData<Accounts, Args>, string>;
    build: (ixnDefinition: ProgramIxnDefinition<Accounts, Args>,
            data: ProgramIxnData<Accounts, Args>) => TransactionInstruction;
}

export type ProgramIxnDefinitionBuilder<Accounts extends ProgramIxnAccountDefinition[], Args extends ProgramIxnArgumentDefinition[]> = PartialRecordKeys<ProgramIxnDefinition<Accounts, Args>, 'update' | 'instantiate'>;

export function defineInstruction<Accounts extends ProgramIxnAccountDefinition[], Args extends ProgramIxnArgumentDefinition[]>(instruction: ProgramIxnDefinitionBuilder<Accounts, Args>): ProgramIxnDefinition<Accounts, Args> {
    if (!instruction.instantiate) {
        instruction.instantiate = defaultInstantiateSolanaInstruction;
    }

    if (!instruction.instantiate) {
        instruction.instantiate = defaultUpdateSolanaInstruction as any;
    }

    return instruction as any;
}

// ----------------------------------------------------------------------------
// Default methods ------------------------------------------------------------
// ----------------------------------------------------------------------------
export function defaultInstantiateSolanaInstruction(ixnDefinition: ProgramIxnDefinition<any, any>): any {
    const result: Record<string, any> = {};

    for (const argument of ixnDefinition.arguments) {
        switch (argument.data.type) {
            case 'bool':
                result[argument.id] = argument.data.defaultValue ?? false;
                break;
            case 'number':
            case 'bytes':
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
                result[argument.id] =
                    argument.data.defaultValue ?? (argument.data.autogenerate ? Keypair.generate() : PublicKey.default);
                break;
            case 'program':
                result[argument.id] = argument.data.defaultValue ?? PublicKey.default;
                break;
        }
    }

    for (const account of ixnDefinition.accounts) {
        switch (account.data.type) {
            case 'address':
                result[account.id] =
                    account.data.defaultValue ?? (account.data.autogenerate ? Keypair.generate() : PublicKey.default);
                break;
            case 'program':
                result[account.id] = account.data.defaultValue ?? PublicKey.default;
                break;
        }
    }

    return result;
}

export function defaultUpdateSolanaInstruction(ixnDefinition: ProgramIxnDefinition<any, any>, data: any,
                                               field: FieldsToArray<any>): PartialRecord<string, string> {
    data[field.fieldName] = field.value as any;

    // No error messages.
    return {};
}

// ----------------------------------------------------------------------------
// Argument definitions -------------------------------------------------------
// ----------------------------------------------------------------------------

export interface ProgramIxnAccountDefinition {
    id: string;
    name: string;
    description?: string;
    readonly?: boolean;
    mutable?: boolean;
    signer?: boolean;
    data: ProgramIxnAccountData;
}

export interface ProgramIxnArgumentDefinition {
    id: string;
    name: string;
    description?: string;
    readonly?: boolean;
    data: ProgramIxnArgumentData;
}

export type ProgramIxnAccountData =
    ProgramIxnProgramArgument
    | ProgramIxnAddressArgument;

export type ProgramIxnArgumentData =
    ProgramIxnBoolArgument
    | ProgramIxnNumberArgument
    | ProgramIxnBytesArgument
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
    min?: number;
    max?: number;
    float?: boolean;
}

export interface ProgramIxnBytesArgument {
    type: 'bytes';
    defaultValue?: number;
    max?: number;
}

export interface ProgramIxnBigNumberArgument {
    type: 'bignum';
    defaultValue?: BN;
    min?: BN;
    max?: BN;
}

export interface ProgramIxnBpsArgument {
    type: 'bps';
    defaultValue?: BN;
    tokenAddress: PublicKey;
}

export interface ProgramIxnStringArgument {
    type: 'string';
    defaultValue?: string;
    maxLength?: number;
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
export type ProgramIxnData<Accounts extends ProgramIxnAccountDefinition[], Args extends ProgramIxnArgumentDefinition[]> =
    ProgramIxnAccountsData<Accounts>
    & ProgramIxnArgumentsData<Args>;
export type ProgramIxnAccountsData<T extends ProgramIxnAccountDefinition[]> = {
    [P in ArrayIndex<T> as T[P]['id']]: FilterProgramIxnType<T[P]['data']>;
};
export type ProgramIxnArgumentsData<T extends ProgramIxnArgumentDefinition[]> = {
    [P in ArrayIndex<T> as T[P]['id']]: FilterProgramIxnType<T[P]['data']>;
};
export type FilterProgramIxnType<T extends ProgramIxnArgumentData, D = T['type']> = D extends 'bool' ? boolean : D extends 'number' | 'bytes' ? number : D extends 'bignum' | 'bps' ? BN : D extends 'string' ? string : D extends 'program' ? PublicKey : D extends 'address' ? PublicKey | Keypair : never;