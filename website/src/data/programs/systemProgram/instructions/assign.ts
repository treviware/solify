import {SystemProgram} from '@solana/web3.js';
import {defineInstruction, ProgramIxnData} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';

const ACCOUNTS = [{
    id: 'assignedAccount',
    name: 'Assigned Account',
    description: 'The account which will be assigned a new owner',
    signer: true,
    mutable: true,
    data: {
        type: 'address',
        autogenerate: true,
    },
}] as const;

const ARGUMENTS = [{
    id: 'programId',
    name: 'Program',
    description: 'The program to assign as the owner',
    data: {
        type: 'program',
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SystemProgramAssignIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SYSTEM_PROGRAM_ASSIGN_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'Assign',
    description: 'Assign an account to a program',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    build(ixnDefinition, data) {
        return SystemProgram.assign({
            accountPubkey: isPubkey(data.assignedAccount) ? data.assignedAccount : data.assignedAccount.publicKey,
            programId: data.programId,
        });
    },
});