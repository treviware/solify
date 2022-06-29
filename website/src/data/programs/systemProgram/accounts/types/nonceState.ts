import {NONCE_DATA_SYSTEM_PROGRAM_ACCOUNT_TYPE} from 'src/data/programs/systemProgram/accounts/types/nonceData';

export const NONCE_STATE_SYSTEM_PROGRAM_ACCOUNT_TYPE = {
    name: 'State',
    type: {
        type: 'enum',
        variants: [{
            id: 'Uninitialized',
            name: 'Uninitialized',
        }, {
            id: 'Initialized',
            name: 'Initialized',
            data: {
                type: 'Tuple',
                innerTypes: [{
                    type: 'Custom',
                    actualTypeName: 'State',
                    actualType: NONCE_DATA_SYSTEM_PROGRAM_ACCOUNT_TYPE,
                }],
            },
        }],
    },
} as const;

