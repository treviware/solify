export type FieldsToArray<T> = {
    [P in keyof T]: {
        fieldName: P; value: T[P];
    };
}[keyof T];

export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export type ArrayIndex<T extends Array<any>> = {
    [P in keyof T]: P;
}[number];

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
}
