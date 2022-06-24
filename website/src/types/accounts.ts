import {ProgramDefinition} from 'src/types/programs/programDefinition';
import {ProgramAccountDefinition} from 'src/types/programs/accountDefinition';

export interface AccountInfoElement {
    program: ProgramDefinition<any, any>;
    account: ProgramAccountDefinition<any, any>;
}