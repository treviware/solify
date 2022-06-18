import {DrawerUtilityButton, RightDrawerState} from 'src/types/drawer';
import WalletsPage from 'pages/utilities/WalletsPage.vue';
import BasisPointsPage from 'pages/utilities/BasisPointsPage.vue';
import RentExemptionPage from 'pages/utilities/RentExemptionPage.vue';
import AirdropPage from 'pages/utilities/AirdropPage.vue';
import {UtilityCategory} from 'src/types/utilities';

export const UTILITY_BUTTONS_BY_CATEGORY: UtilityCategory[] = [{
    name: 'Solana Utilities',
    description: 'Solana\'s utility tools are designed to help you manage your account\'s assets and liabilities.',
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
        description: 'An utility to airdrop some SOL to a given address',
        rightDrawerOption: RightDrawerState.Airdrop,
        component: AirdropPage,
    }],
}, {
    name: 'SPL Token Utilities',
    description: 'Utilities to manage your SPL tokens.',
    buttons: [{
        icon: 'fa-solid fa-right-left',
        name: 'Basis Points',
        description: 'Change between basis points and real value',
        rightDrawerOption: RightDrawerState.Bps,
        component: BasisPointsPage,
    }],
}];

export const UTILITY_BUTTONS = UTILITY_BUTTONS_BY_CATEGORY.reduce((acc, category) => acc.concat(category.buttons),
    [] as DrawerUtilityButton[]);