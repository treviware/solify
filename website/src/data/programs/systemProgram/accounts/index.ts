import {defineProgramAccounts} from 'src/types/programs/accountDefinition';
import {WALLET_SYSTEM_PROGRAM_ACCOUNT} from 'src/data/programs/systemProgram/accounts/wallet';
import {NONCE_VERSIONS_SYSTEM_PROGRAM_ACCOUNT_TYPE} from 'src/data/programs/systemProgram/accounts/types/nonceVersions';
import {NONCE_SYSTEM_PROGRAM_ACCOUNT} from 'src/data/programs/systemProgram/accounts/nonce';
import {WALLET_SYSTEM_PROGRAM_ACCOUNT_TYPE} from 'src/data/programs/systemProgram/accounts/types/wallet';
import {NONCE_DATA_SYSTEM_PROGRAM_ACCOUNT_TYPE} from 'src/data/programs/systemProgram/accounts/types/nonceData';
import {NONCE_STATE_SYSTEM_PROGRAM_ACCOUNT_TYPE} from 'src/data/programs/systemProgram/accounts/types/nonceState';
import {FEE_CALCULATOR_ACCOUNT_TYPE} from 'src/data/accounts/solana/feeCalculator';

export const SYSTEM_PROGRAM_ACCOUNTS = defineProgramAccounts({
    types: [WALLET_SYSTEM_PROGRAM_ACCOUNT_TYPE, NONCE_VERSIONS_SYSTEM_PROGRAM_ACCOUNT_TYPE,
        NONCE_STATE_SYSTEM_PROGRAM_ACCOUNT_TYPE, NONCE_DATA_SYSTEM_PROGRAM_ACCOUNT_TYPE],
    systemTypes: [FEE_CALCULATOR_ACCOUNT_TYPE],
    accounts: [WALLET_SYSTEM_PROGRAM_ACCOUNT as any, NONCE_SYSTEM_PROGRAM_ACCOUNT],
});