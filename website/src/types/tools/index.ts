import {DrawerToolButton} from 'src/types/drawer';

export interface ToolCategory {
    name: string;
    description: string;
    buttons: DrawerToolButton[];
}