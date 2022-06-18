import {DefineComponent} from 'vue';

export enum RightDrawerState {
    Closed = 'closed',
    Wallets = 'wallets',
    Bps = 'bps',
    Rent = 'rent-exempt',
    Airdrop = 'airdrop',
}

export type DrawerButton =
    DrawerAppButton
    | DrawerUtilityButton;

export type DrawerAppButton =
    DrawerButtonBase
    & {
    pathName: string;
};

export type DrawerUtilityButton =
    DrawerButtonBase
    & {
    rightDrawerOption: RightDrawerState, component: DefineComponent<any, any, any, any, any, any, any, any, any, any, any, any>,
};

export interface DrawerButtonBase {
    icon: string;
    name: string;
    description: string;
    headerName?: string;
    headerDescription?: string;
}

export function isDrawerAppButton(button: DrawerButton): button is DrawerAppButton {
    return (button as any).pathName !== undefined;
}

export function isDrawerUtilityButton(button: DrawerButton): button is DrawerUtilityButton {
    return (button as any).rightDrawerOption !== undefined;
}