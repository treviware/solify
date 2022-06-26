import {defineStore} from 'pinia';
import {TransactionGroupDefinition} from 'src/types/transactions/groupDefinition';
import {PublicKey, Transaction} from '@solana/web3.js';
import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';
import {SOLIFY_PROGRAM_FEE_INSTRUCTION} from 'src/data/programs/solify/instructions/fee';
import {useWallet} from 'solana-wallets-vue';

let groupNumber = 2;
export const useTxBuilderApp = defineStore('txBuilderApp', {
    state: () => {
        const wallet = useWallet();

        return {
            groups: [{
                name: 'Group 1',
                transactions: [{
                    name: 'Transaction 1',
                    instructions: [SOLIFY_PROGRAM_FEE_INSTRUCTION],
                    data: [SOLIFY_PROGRAM_FEE_INSTRUCTION.instantiate(SOLIFY_PROGRAM_FEE_INSTRUCTION)],
                    payer: wallet.publicKey.value ?? PublicKey.default,
                }],
            }] as TransactionGroupDefinition[],
            groupIndex: 0,
        };
    },
    getters: {
        currentGroup: (state) => state.groups[state.groupIndex],
        web3Transactions(): Transaction[] {
            return this.currentGroup.transactions.map(tx => {
                const finalTx = new Transaction();
                finalTx.instructions =
                    tx.instructions.map((ixn: ProgramIxnDefinition<any, any>, i: number) => ixn.build(ixn, tx.data[i]));
                finalTx.feePayer = tx.payer;
                finalTx.recentBlockhash = PublicKey.default.toBase58();

                return finalTx;
            });
        },
        encodedTransactions(): Buffer[] {
            return this.web3Transactions.map(tx => tx.serialize({
                requireAllSignatures: false,
                verifySignatures: false,
            }));
        },
    },
    actions: {
        addGroup() {
            const wallet = useWallet();

            this.groups.push({
                name: `Group ${groupNumber}`,
                transactions: [{
                    name: 'Transaction 1',
                    instructions: [SOLIFY_PROGRAM_FEE_INSTRUCTION],
                    data: [SOLIFY_PROGRAM_FEE_INSTRUCTION.instantiate(SOLIFY_PROGRAM_FEE_INSTRUCTION)],
                    payer: wallet.publicKey.value ?? PublicKey.default,
                }],
            });

            groupNumber += 1;
        },
        removeGroup(index: number) {
            if (this.groups.length <= 1) {
                return;
            }

            if (this.groupIndex >= index && this.groupIndex > 0) {
                this.groupIndex -= 1;
            }

            this.groups.splice(index, 1);
        },
    },
});