export interface AppCategory {
    name: string;
    description: string;
    buttons: AppCategoryButton[];
}

export interface AppCategoryButton {
    icon: string;
    name: string;
    description: string;
    pathName: string;
    parent?: string;
}