import {TransactionDefinition} from 'src/types/transactions/transactionDefinition';

export interface TransactionGroupDefinition<Transactions extends TransactionDefinition<any, any>[] = TransactionDefinition<any, any>[]> {
    name: string;
    transactions: Transactions;
}