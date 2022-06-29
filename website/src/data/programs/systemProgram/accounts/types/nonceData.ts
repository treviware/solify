import {FEE_CALCULATOR_ACCOUNT_TYPE} from 'src/data/accounts/solana/feeCalculator';

export const NONCE_DATA_SYSTEM_PROGRAM_ACCOUNT_TYPE = {
    name: 'Data',
    type: {
        type: 'struct',
        fields: [{
            id: 'authority',
            name: 'Authority',
            data: {
                type: 'Pubkey',
            },
        }, {
            id: 'nonce',
            name: 'Nonce',
            data: {
                type: 'Pubkey',
            },
        }, {
            id: 'fee_calculator',
            name: 'Fee Calculator',
            data: {
                type: 'Custom',
                actualTypeName: 'FeeCalculator',
                actualType: FEE_CALCULATOR_ACCOUNT_TYPE,
            },
        }],
    },
} as const;

