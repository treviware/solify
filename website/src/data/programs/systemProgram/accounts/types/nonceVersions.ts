import {NONCE_STATE_SYSTEM_PROGRAM_ACCOUNT_TYPE} from 'src/data/programs/systemProgram/accounts/types/nonceState';

export const NONCE_VERSIONS_SYSTEM_PROGRAM_ACCOUNT_TYPE = {
    name: 'Versions',
    type: {
        type: 'enum',
        variants: [{
            id: 'Current',
            name: 'Current',
            data: {
                type: 'Tuple',
                innerTypes: [{
                    type: 'Custom',
                    actualTypeName: 'State',
                    actualType: NONCE_STATE_SYSTEM_PROGRAM_ACCOUNT_TYPE,
                }],
            },
        }],
    },
} as const;