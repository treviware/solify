import {defineStore} from 'pinia';
import {TransactionGroupDefinition} from 'src/types/transactions/groupDefinition';
import {PublicKey, Transaction} from '@solana/web3.js';
import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';

let groupNumber = 2;
export const useTxBuilderApp = defineStore('txBuilderApp', {
    state: () => ({
        groups: [{
            name: 'Group 1',
            transactions: [{
                name: 'Transaction 1',
                instructions: [],
                data: [],
                payer: PublicKey.default,
            }],
        }] as TransactionGroupDefinition[],
        groupIndex: 0,
    }),
    getters: {
        currentGroup: (state) => state.groups[state.groupIndex],
        web3Transactions(): Transaction[] {
            return this.currentGroup.transactions.map(tx => {
                const finalTx = new Transaction();
                tx.instructions =
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
            this.groups.push({
                name: `Group ${groupNumber}`,
                transactions: [{
                    name: 'Transaction 1',
                    instructions: [],
                    data: [],
                    payer: PublicKey.default,
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