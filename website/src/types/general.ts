export type FieldsToArray<T> = {
    [P in keyof T]: {
        fieldName: P; value: T[P];
    };
}[keyof T];

export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
