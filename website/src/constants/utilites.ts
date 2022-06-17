import {DrawerUtilityButton, RightDrawerState} from 'src/types/drawer';
import WalletsPage from 'pages/utilities/WalletsPage.vue';
import BasisPointsPage from 'pages/utilities/BasisPointsPage.vue';
import RentExemptionPage from 'pages/utilities/RentExemptionPage.vue';

export const UTILITY_BUTTONS: DrawerUtilityButton[] = [{
    icon: 'fa-solid fa-wallet',
    name: 'Wallet List',
    description: 'The list of all connected wallets',
    rightDrawerOption: RightDrawerState.Wallets,
    component: WalletsPage,
}, {
    icon: 'fa-solid fa-right-left',
    name: 'Basis Points',
    description: 'Change between basis points and real value',
    rightDrawerOption: RightDrawerState.Bps,
    component: BasisPointsPage,
}, {
    icon: 'fa-solid fa-hand-holding-dollar',
    name: 'Rent Exemption',
    description: 'Get the rent you must pay for an account with a given size to be rent exempt',
    rightDrawerOption: RightDrawerState.Rent,
    component: RentExemptionPage,
}];