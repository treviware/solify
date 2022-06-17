import {DrawerAppButton} from 'src/types/drawer';

export const APP_BUTTONS: DrawerAppButton[] = [{
    icon: 'fa-solid fa-code-commit',
    name: 'Transaction Builder',
    description: 'Build custom transactions mixing different instructions',
    pathName: 'TxBuilder',
}, {
    icon: 'fa-solid fa-code',
    name: 'Solana Programs',
    description: 'Manage the list of programs available to work with',
    pathName: 'SolanaPrograms',
}, {
    icon: 'fa-solid fa-screwdriver-wrench',
    name: 'Utilities',
    description: 'Select the utility you need',
    pathName: 'Utilities',
}, {
    icon: 'fa-solid fa-gear',
    name: 'Settings',
    description: 'Configure the application to suit your needs',
    pathName: 'Settings',
}];