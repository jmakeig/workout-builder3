export type FormInput<T> = {
    [p in keyof T]: T[p] | null | string | FormDataEntryValue;
}
