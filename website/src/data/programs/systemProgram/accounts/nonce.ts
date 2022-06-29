import {defineProgramAccount} from 'src/types/programs/accountDefinition';
import {struct} from '@solana/buffer-layout';
import {NONCE_ACCOUNT_LENGTH} from '@solana/web3.js';
import {NONCE_VERSIONS_SYSTEM_PROGRAM_ACCOUNT_TYPE} from 'src/data/programs/systemProgram/accounts/types/nonceVersions';

export const NONCE_SYSTEM_PROGRAM_ACCOUNT = defineProgramAccount<typeof NONCE_VERSIONS_SYSTEM_PROGRAM_ACCOUNT_TYPE>({
    name: 'Nonce account',
    description: 'A system account that doesn\'t contain any data',
    fixedSize: NONCE_ACCOUNT_LENGTH,
    type: NONCE_VERSIONS_SYSTEM_PROGRAM_ACCOUNT_TYPE,
    layout: struct([]),
});