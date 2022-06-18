import {DrawerToolButton, RightDrawerState} from 'src/types/drawer';
import WalletsPage from 'pages/tools/WalletsPage.vue';
import BasisPointsPage from 'pages/tools/BasisPointsPage.vue';
import RentExemptionPage from 'pages/tools/RentExemptionPage.vue';
import AirdropPage from 'pages/tools/AirdropPage.vue';
import TokenPricePage from 'pages/tools/TokenPricePage.vue';
import {ToolCategory} from 'src/types/tools';

export const TOOL_BUTTONS_BY_CATEGORY: ToolCategory[] = [{
    name: 'Solana Tools',
    description: 'Tools to help you manage your accounts.',
    buttons: [{
        icon: 'fa-solid fa-wallet',
        name: 'Wallet List',
        description: 'The list of all connected wallets',
        rightDrawerOption: RightDrawerState.Wallets,
        component: WalletsPage,
    }, {
        icon: 'fa-solid fa-hand-holding-dollar',
        name: 'Rent Exemption',
        description: 'Get the rent you must pay for an account with a given size to be rent exempt',
        rightDrawerOption: RightDrawerState.Rent,
        component: RentExemptionPage,
    }, {
        icon: 'fa-solid fa-parachute-box',
        name: 'Airdrop',
        description: 'An tool to airdrop some SOL to a given address',
        rightDrawerOption: RightDrawerState.Airdrop,
        component: AirdropPage,
    }],
}, {
    name: 'SPL Token Tools',
    description: 'Tools to manage your SPL tokens.',
    buttons: [{
        icon: 'fa-solid fa-right-left',
        name: 'Basis Points',
        description: 'Change between basis points and real value',
        rightDrawerOption: RightDrawerState.Bps,
        component: BasisPointsPage,
    }],
}, {
    name: 'Currencies',
    description: 'Tools to get and compare token values in different currencies.',
    buttons: [{
        icon: 'fa-solid fa-right-left',
        name: 'Token Price',
        description: 'Get the current price of a token in a supported currency or any other token.',
        rightDrawerOption: RightDrawerState.TokenPrice,
        component: TokenPricePage,
    }],
}];

export const TOOL_BUTTONS = TOOL_BUTTONS_BY_CATEGORY.reduce((acc, category) => acc.concat(category.buttons),
    [] as DrawerToolButton[]);