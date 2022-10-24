import {DrawerAppBreadcrumbsItem, DrawerAppButton, DrawerAppButtonChild} from 'src/types/drawer';

export const MENU_BUTTONS: DrawerAppButton[] = [{
    icon: 'fa-solid fa-code',
    name: 'Apps',
    description: '',
    pathName: 'Apps',
    children: [{
        name: 'Transaction Builder',
        pathName: 'TxBuilderApp',
    }, {
        name: 'Program Explorer',
        pathName: 'ProgramExplorer',
        children: [{
            name: 'Program',
            pathName: 'Program',
        }],
    }],
}, {
    icon: 'fa-solid fa-screwdriver-wrench',
    name: 'Tools',
    description: '',
    pathName: 'Tools',
}, {
    icon: 'fa-solid fa-gear',
    name: 'Settings',
    description: '',
    pathName: 'Settings',
}];

export function getBreadcrumbsForPathName(pathName: string): DrawerAppBreadcrumbsItem[] {
    for (const button of MENU_BUTTONS) {
        if (button.pathName === pathName) {
            return [{
                name: button.name,
                pathName: button.pathName,
            }];
        }

        if (button.children) {
            const childrenBreadcrumbs = getChildrenBreadcrumbs(button.children, pathName);
            if (childrenBreadcrumbs) {
                return [{
                    name: button.name,
                    pathName: button.pathName,
                }, ...childrenBreadcrumbs];
            }
        }
    }

    return [];
}

function getChildrenBreadcrumbs(children: DrawerAppButtonChild[], pathName: string): DrawerAppBreadcrumbsItem[] | null {
    for (const child of children) {
        if (child.pathName === pathName) {
            return [{
                name: child.name,
                pathName: child.pathName,
            }];
        }

        if (child.children) {
            const childrenBreadcrumbs = getChildrenBreadcrumbs(child.children, pathName);
            if (childrenBreadcrumbs) {
                return [{
                    name: child.name,
                    pathName: child.pathName,
                }, ...childrenBreadcrumbs];
            }
        }
    }

    return null;
}