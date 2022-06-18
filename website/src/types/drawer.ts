import {DefineComponent} from 'vue';

export enum RightDrawerState {
    Closed = 'closed',
    Wallets = 'wallets',
    Bps = 'bps',
    Rent = 'rent-exempt',
    Airdrop = 'airdrop',
    TokenPrice = 'token-price',
}

export type DrawerButton =
    DrawerAppButton
    | DrawerToolButton;

export type DrawerAppButton =
    DrawerButtonBase
    & {
    pathName: string;
};

export type DrawerToolButton =
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

export function isDrawerToolButton(button: DrawerButton): button is DrawerToolButton {
    return (button as any).rightDrawerOption !== undefined;
}