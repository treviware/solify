import {DefineComponent} from 'vue';

export enum RightDrawerState {
    Closed = 'closed',
    Wallets = 'wallets',
    Bps = 'bps',
    Rent = 'rent-exempt',
    Airdrop = 'airdrop',
    TokenPrice = 'token-price',
    KeypairGenerator = 'keypair-generator',
    VanityAddress = 'vanity-address',
    SignMessage = 'sign-message',
    VerifySignature = 'verify-signature',
}

export type DrawerButton =
    DrawerAppButton
    | DrawerToolButton;

export type DrawerAppButton =
    DrawerButtonBase
    & {
    pathName: string; pathAlias?: string[];
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