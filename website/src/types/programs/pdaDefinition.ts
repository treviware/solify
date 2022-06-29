import BN from 'bn.js';
import {PublicKey} from '@solana/web3.js';

export interface PdaDefinition {
    name: string;
    description?: string;
    arguments: PdaArgumentData[];
}

export function definePda(pda: PdaDefinition): PdaDefinition {
    return pda;
}

export type PdaArgumentData =
    PdaNumberArgument
    | PdaBigNumberArgument
    | PdaStringArgument
    | PdaAddressArgument;

export interface PdaNumberArgument {
    type: 'number';
    bytes: number;
    defaultValue?: number;
    isConstant?: boolean;
}

export interface PdaBigNumberArgument {
    type: 'bignum';
    bytes: number;
    defaultValue?: BN;
    isConstant?: boolean;
}

export interface PdaStringArgument {
    type: 'string';
    defaultValue?: string;
    isConstant?: boolean;
}

export interface PdaAddressArgument {
    type: 'address';
    defaultValue?: PublicKey;
    isConstant?: boolean;
}