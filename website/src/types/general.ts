export type FieldsToArray<T> = {
    [P in keyof T]: {
        fieldName: P; value: T[P];
    };
}[keyof T];

export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export type ArrayIndex<T extends readonly any[]> = {
    [P in keyof T]: P;
}[number];

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
}

export type DeepMutable<T> = {
    -readonly [P in keyof T]: DeepMutable<T[P]>;
}

export type PartialRecordKeys<T, K extends keyof T> =
    Partial<Pick<T, K>>
    & Omit<T, K>;