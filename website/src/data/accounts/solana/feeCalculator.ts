export const FEE_CALCULATOR_ACCOUNT_TYPE = {
    name: 'FeeCalculator',
    type: {
        type: 'struct',
        fields: [{
            id: 'lamports_per_signature',
            name: 'Lamports per signature',
            description: 'The current cost of a signature  This amount may increase/decrease over time based on cluster processing load',
            data: {
                type: 'u64',
            },
        }],
    },
} as const;