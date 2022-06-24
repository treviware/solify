import {defineProgramAccount} from 'src/types/programs/accountDefinition';
import {struct} from '@solana/buffer-layout';

export const SYSTEM_PROGRAM_WALLET_ACCOUNT = defineProgramAccount({
    name: 'System account',
    description: 'A system account that doesn\'t contain any data',
    minSize: 0,
    layout: struct<Record<string, unknown>>([]),

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    defaultLayout: () => ({}),
});