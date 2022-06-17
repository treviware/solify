import {ACCOUNT_SIZE, MINT_SIZE, MULTISIG_SIZE} from '@solana/spl-token';
import {AccountInfoElement} from 'src/types/accounts';

export const ACCOUNTS_INFO: AccountInfoElement[] = [{
    programName: 'System Program',
    name: 'Account',
    size: 0,
}, {
    programName: 'Solana Token Program',
    name: 'Account',
    size: ACCOUNT_SIZE,
}, {
    programName: 'Solana Token Program',
    name: 'Mint',
    size: MINT_SIZE,
}, {
    programName: 'Solana Token Program',
    name: 'Multisig',
    size: MULTISIG_SIZE,
}];