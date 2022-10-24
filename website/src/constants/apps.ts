import {AppCategory} from 'src/types/apps';

export const APP_BUTTONS_BY_CATEGORY: AppCategory[] = [{
    name: 'Solana Tools',
    description: 'Tools to help you manage your accounts.',
    buttons: [{
        icon: 'fa-solid fa-code-commit',
        name: 'Transaction Builder',
        description: 'Build custom transactions mixing different instructions',
        pathName: 'TxBuilderApp',
    }, {
        icon: 'fa-solid fa-code',
        name: 'Program Explorer',
        description: 'Inspect and manage the list of available programs to work with',
        pathName: 'ProgramExplorer',
    }],
}];