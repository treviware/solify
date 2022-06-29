import {Layout} from '@solana/buffer-layout';
import {ArrayIndex, PartialRecordKeys} from 'src/types/general';
import {PublicKey} from '@solana/web3.js';

export interface ProgramAccountsDefinition<Types extends readonly ProgramAccountTypeDefinition[], SystemTypes extends readonly ProgramAccountTypeDefinition[], Accounts extends readonly ProgramAccountDefinition<any>[]> {
    readonly types: Types;
    readonly systemTypes: SystemTypes;
    readonly accounts: Accounts;
}

export interface ProgramAccountDefinition<Type extends ProgramAccountTypeDefinition> {
    readonly name: string;
    readonly description?: string;
    readonly minSize: number;
    readonly fixedSize?: number;
    readonly type: Type;
    readonly layout: Layout<ProgramAccountTypeLayout<Type>>;
    readonly defaultLayout: (account: ProgramAccountDefinition<Type>) => ProgramAccountTypeLayout<Type>;
    readonly actualSizeCalculator: (value: ProgramAccountTypeLayout<Type>,
                                    account: ProgramAccountTypeLayout<Type>) => number;
}

export type ProgramAccountDefinitionBuilder<Type extends ProgramAccountTypeDefinition> = PartialRecordKeys<ProgramAccountDefinition<Type>, 'minSize' | 'actualSizeCalculator' | 'defaultLayout'>;

export function defineProgramAccounts<Types extends readonly ProgramAccountTypeDefinition[], SystemTypes extends readonly ProgramAccountTypeDefinition[], Accounts extends readonly ProgramAccountDefinition<any>[]>(account: ProgramAccountsDefinition<Types, SystemTypes, Accounts>): ProgramAccountsDefinition<Types, SystemTypes, Accounts> {
    return account;
}

export function defineProgramAccount<Type extends ProgramAccountTypeDefinition>(account: ProgramAccountDefinitionBuilder<Type>): ProgramAccountDefinition<Type> {
    if (!account.defaultLayout) {
        (account as any).defaultLayout = defaultLayoutMethod as any;
    }

    if (!account.actualSizeCalculator) {
        (account as any).actualSizeCalculator = defaultActualSizeCalculator as any;
    }

    if (!account.minSize) {
        if (account.fixedSize !== undefined) {
            (account as any).minSize = account.fixedSize;
        } else {
            (account as any).minSize =
                account.actualSizeCalculator!(account.defaultLayout!(account as any), account as any);
        }
    }

    return account as any;
}

// ----------------------------------------------------------------------------
// Default methods ------------------------------------------------------------
// ----------------------------------------------------------------------------
export function defaultLayoutMethod<Type extends ProgramAccountTypeDefinition>(account: ProgramAccountDefinition<Type>): ProgramAccountTypeLayout<Type> {

    return defaultLayoutMethodAux<Type>(account.type);
}

function defaultLayoutMethodAux<Type extends ProgramAccountTypeDefinition>(type: Type): ProgramAccountTypeLayout<Type> {
    switch (type.type.type) {
        case 'struct':
            return defaultLayoutProcessFields(type.type.fields) as any;
        case 'enum': {
            const variant = type.type.variants[0];

            // Return empty.
            if (variant.data === undefined) {
                return {
                    variant: variant.id,
                } as any;
            }

            if (Array.isArray(variant.data)) {
                return defaultLayoutProcessFields(variant.data) as any;
            } else {
                return (defaultLayoutProcessFields([{
                    id: 'a',
                    name: 'a_name',
                    data: variant.data as ProgramAccountTupleField,
                }]) as any).a;
            }
        }
    }

    return {} as any;
}

function defaultLayoutProcessFields<T extends readonly ProgramAccountFieldDefinition[]>(fields: T): ProgramAccountFieldsToLayout<T> {
    const result = {} as any;

    for (const field of fields) {
        result[field.id] = defaultLayoutProcessFieldData<T[number]['data']>(field.data);
    }

    return result;
}

function defaultLayoutProcessFieldData<T extends ProgramAccountFieldData>(field: T): ProgramAccountFieldDataToLayout<T> {
    switch (field.type) {
        case 'bool':
            return false as any;
        case 'u8' :
        case  'i8' :
        case  'u16' :
        case  'i16' :
        case  'u32' :
        case  'i32' :
        case  'char':
            return 0 as any;
        case 'u64' :
        case 'i64' :
        case 'u128' :
        case 'i128':
            return BigInt(0) as any;
        case 'String':
            return '' as any;
        case 'Pubkey':
            return PublicKey.default as any;
        case 'Tuple':
            const value: any[] = [];

            for (const type of field.innerTypes) {
                value.push(defaultLayoutProcessFieldData<T>(type as any));
            }

            return value as any;
        case 'Vec':
            return [] as any;
        case 'Option':
            return null as any;
        case 'Custom':
            if (field.actualType === undefined) {
                return {} as any;
            } else {
                return defaultLayoutMethodAux(field.actualType) as any;
            }
    }
}

export function defaultActualSizeCalculator<Type extends ProgramAccountTypeDefinition>(value: ProgramAccountTypeLayout<Type>,
                                                                                       account: ProgramAccountDefinition<Type>): number {
    if (account.fixedSize !== undefined) {
        return account.fixedSize;
    }

    return defaultActualSizeCalculatorAux<Type>(value, account.type);
}

function defaultActualSizeCalculatorAux<Type extends ProgramAccountTypeDefinition>(value: ProgramAccountTypeLayout<Type>,
                                                                                   type: Type): number {
    switch (type.type.type) {
        case 'struct':
            return (defaultActualSizeCalculatorProcessFields as any)(value, type.type.fields);
        case 'enum': {
            const variant = type.type.variants[0];
            const discriminator = 1;

            // Return empty.
            if (variant.data === undefined) {
                return discriminator;
            }

            if (Array.isArray(variant.data)) {
                return defaultActualSizeCalculatorProcessFields((value as any).value, variant.data) + discriminator;
            } else {
                return defaultActualSizeCalculatorProcessFields({a: (value as any).value} as any, [{
                    id: 'a',
                    name: 'a_name',
                    data: variant.data as ProgramAccountTupleField,
                }]) + discriminator;
            }
        }
    }

    return {} as any;
}

function defaultActualSizeCalculatorProcessFields<T extends ProgramAccountFieldDefinition[]>(value: ProgramAccountFieldsToLayout<T>,
                                                                                             fields: T): number {
    let result = 0;

    for (const field of fields) {
        result += (defaultActualSizeCalculatorProcessFieldData as any)((value as any)[field.id], field.data);
    }

    return result;
}

function defaultActualSizeCalculatorProcessFieldData<T extends ProgramAccountFieldData>(value: any, field: T): number {
    switch (field.type) {
        case 'bool':
        case 'u8' :
        case  'i8' :
            return 1;
        case  'u16' :
        case  'i16' :
            return 2;
        case  'u32' :
        case  'i32' :
        case  'char':
            return 4;
        case 'u64' :
        case 'i64' :
            return 8;
        case 'u128' :
        case 'i128':
            return 16;
        case 'String': {
            const lengthField = 4;
            return lengthField + new TextEncoder().encode(value as string).length;
        }
        case 'Pubkey':
            return 32;
        case 'Tuple': {
            let result = 0;
            const v = value as any[];

            for (let i = 0; i < field.innerTypes.length; i++) {
                const type = field.innerTypes[i];
                const value = v[i];
                result += defaultActualSizeCalculatorProcessFieldData(value, type);
            }

            return result;
        }
        case 'Vec': {
            let result = 4;
            const v = value as any[];

            for (let i = 0; i < v.length; i++) {
                const value = v[i];
                result += defaultActualSizeCalculatorProcessFieldData(value, field.innerType);
            }

            return result;
        }
        case 'Option': {
            const discriminator = 1;

            if (value == null) {
                return discriminator;
            } else {
                return discriminator + defaultActualSizeCalculatorProcessFieldData(value, field.innerType);
            }
        }
        case 'Custom':
            if (field.actualType === undefined) {
                return 0;
            } else {
                return defaultActualSizeCalculatorAux(value, field.actualType);
            }
    }
}

export function getProgramAccountFieldDataName(data: ProgramAccountFieldData): string {
    switch (data.type) {
        case 'Tuple':
            return `[${data.innerTypes.map(v => getProgramAccountFieldDataName(v)).join(', ')}]`;
        case 'Vec':
            return `Vec<${getProgramAccountFieldDataName(data.innerType)}>`;
        case 'Option':
            return `Option<${getProgramAccountFieldDataName(data.innerType)}>`;
        case 'Custom':
            return data.actualTypeName;
        default:
            return data.type;
    }
}

// ----------------------------------------------------------------------------
// Field definitions ----------------------------------------------------------
// ----------------------------------------------------------------------------
export interface ProgramAccountTypeDefinition {
    readonly name: string;
    readonly description?: string;
    readonly type: ProgramAccountType;
}

export type ProgramAccountType =
    ProgramAccountStructType
    | ProgramAccountEnumType;

export interface ProgramAccountStructType {
    readonly type: 'struct';
    readonly fields: readonly ProgramAccountFieldDefinition[];
}

export interface ProgramAccountEnumType {
    readonly type: 'enum';
    readonly variants: readonly ProgramAccountVariantDefinition[];
}

export interface ProgramAccountFieldDefinition {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly data: ProgramAccountFieldData;
}

export interface ProgramAccountVariantDefinition {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly data?: ProgramAccountTupleField | readonly ProgramAccountFieldDefinition[];
}

export type ProgramAccountFieldData =
    ProgramAccountBoolField
    | ProgramAccountNumberField
    | ProgramAccountBigNumberField
    | ProgramAccountStringField
    | ProgramAccountPubkeyField
    | ProgramAccountTupleField
    | ProgramAccountVecField
    | ProgramAccountOptionField
    | ProgramAccountCustomField;

export interface ProgramAccountBoolField {
    readonly type: 'bool';
}

export interface ProgramAccountNumberField {
    readonly type: 'u8' | 'i8' | 'u16' | 'i16' | 'u32' | 'i32' | 'char';
}

export interface ProgramAccountBigNumberField {
    readonly type: 'u64' | 'i64' | 'u128' | 'i128';
}

export interface ProgramAccountStringField {
    readonly type: 'String';
}

export interface ProgramAccountPubkeyField {
    readonly type: 'Pubkey';
}

export interface ProgramAccountTupleField {
    readonly type: 'Tuple';
    readonly innerTypes: readonly ProgramAccountFieldData[];
}

export interface ProgramAccountVecField {
    readonly type: 'Vec';
    readonly innerType: ProgramAccountFieldData;
}

export interface ProgramAccountOptionField {
    readonly type: 'Option';
    readonly innerType: ProgramAccountFieldData;
}

export interface ProgramAccountCustomField {
    readonly type: 'Custom';
    readonly actualTypeName: string;
    readonly actualType?: ProgramAccountTypeDefinition;
}

// ----------------------------------------------------------------------------
// Type guessing ----------------------------------------------------------
// ----------------------------------------------------------------------------
export type ProgramAccountLayout<T extends ProgramAccountDefinition<any>> = ProgramAccountTypeLayout<T['type']>;
export type ProgramAccountTypeLayout<T extends ProgramAccountTypeDefinition> = T['type'] extends ProgramAccountStructType ? ProgramAccountFieldsToLayout<T['type']['fields']> : T['type'] extends ProgramAccountEnumType ? ProgramAccountVariantsLayout<T['type']['variants']> : undefined;
export type ProgramAccountFieldsToLayout<T extends readonly ProgramAccountFieldDefinition[]> = {
    [P in ArrayIndex<T> as T[P]['id']]: ProgramAccountFieldDataToLayout<T[P]['data']>;
};
export type ProgramAccountVariantsLayout<T extends readonly ProgramAccountVariantDefinition[]> = {
    [P in ArrayIndex<T>]: ProgramAccountVariantLayout<T[P]>;
}[ArrayIndex<T>];
export type ProgramAccountVariantLayout<T extends ProgramAccountVariantDefinition> = T['data'] extends ProgramAccountTupleField ? {
    variant: T['id'], value: ProgramAccountFieldDataToLayout<T['data']>
} : T['data'] extends readonly ProgramAccountFieldDefinition[] ? {
    variant: T['id'], value: ProgramAccountFieldsToLayout<T['data']>
} : {
    variant: T['id']
};
export type ProgramAccountFieldDataToLayout<T extends ProgramAccountFieldData> = T extends ProgramAccountBoolField ? boolean : T extends ProgramAccountNumberField ? number : T extends ProgramAccountBigNumberField ? bigint : T extends ProgramAccountStringField ? string : T extends ProgramAccountPubkeyField ? PublicKey : T extends ProgramAccountTupleField ? ProgramAccountFieldTupleDataToLayout<T['innerTypes']> : T extends ProgramAccountVecField ? ProgramAccountFieldDataToLayout<T['innerType']>[] : T extends ProgramAccountOptionField ? ProgramAccountFieldDataToLayout<T['innerType']> | null : T extends ProgramAccountCustomField ? ProgramAccountFieldCustomDataToLayout<T['actualType']> : never;
export type ProgramAccountFieldTupleDataToLayout<T extends readonly ProgramAccountFieldData[]> = {
    [K in keyof T]: T[K] extends ProgramAccountFieldData ? ProgramAccountFieldDataToLayout<T[K]> : T[K]
}
export type ProgramAccountFieldCustomDataToLayout<T extends ProgramAccountTypeDefinition | undefined> = T extends ProgramAccountTypeDefinition ? ProgramAccountTypeLayout<T> : any;