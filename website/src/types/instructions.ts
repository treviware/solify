import {ProgramDefinition} from 'src/types/programs/programDefinition';
import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';

export interface InstructionInfoElement {
    program: ProgramDefinition<any, any>;
    instruction: ProgramIxnDefinition<any, any>;
}