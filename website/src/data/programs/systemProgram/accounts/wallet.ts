import {defineProgramAccount} from 'src/types/programs/accountDefinition';
import {struct} from '@solana/buffer-layout';
import {WALLET_SYSTEM_PROGRAM_ACCOUNT_TYPE} from 'src/data/programs/systemProgram/accounts/types/wallet';

export const WALLET_SYSTEM_PROGRAM_ACCOUNT = defineProgramAccount<typeof WALLET_SYSTEM_PROGRAM_ACCOUNT_TYPE>({
    name: 'System account',
    description: 'A system account that doesn\'t contain any data',
    fixedSize: 0,
    type: WALLET_SYSTEM_PROGRAM_ACCOUNT_TYPE,
    layout: struct([]),
} as const);