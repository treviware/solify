import {SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'account',
    name: 'Account',
    description: 'The account to allocate',
    signer: true,
    mutable: true,
    data: {
        type: 'address',
        autogenerate: true,
    },
}] as const;

const ARGUMENTS = [{
    id: 'space',
    name: 'Space',
    description: 'Number of bytes of memory to allocate',
    data: {
        type: 'bytes',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramAllocateIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_ALLOCATE_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'Allocate',
    description: 'Allocate space in a (possibly new) account without funding it',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.allocate({
            accountPubkey: isPubkey(data.account) ? data.account : data.account.publicKey,
            space: data.space,
        });
    },
});