export type FormInput<T> = {
    [p in keyof T]: T[p] | null | string | FormDataEntryValue;
}

/**
 * Like `Pick`, but matches on property type rather than key name.
 * 
 * @example 
 * PickMatch<{name: string, lucky_numbers: Array<number>}, Array<any>> // type { lucky_numbers: Array<number> }
 */
type PickMatch<Type, Union> = {
    [P in keyof Type as Type[P] extends Union ? P : never]: Type[P];
};

/**
 * Require at least one of the properties of `T`.
 * This is especially useful for `Record` types.
 */
type AtLeastOne<T> = {
    [K in keyof T]-?: Pick<T, K> & Partial<T>
}[keyof T]

type Locale = "en" | "fr";
/**
 * Allows you to reference any key of `Entity` by name, 
 * as well as an optional offset for `Array` properties.
 *
 * @example
 * Forable<{a: string; b: Array<number>}> // 'a' | 'b' | 'b[#]', where # is any number
 */

type Forable<Entity> = `${string & keyof Entity}` | `${string & keyof PickMatch<Entity, Array<unknown>>}[${number}]`;
/**
 * A validation message. Typical usage is for communicating business rule violations
 * back to users. `for` can optionally reference a property in the entity being validated by name, 
 * e.g. `'id'` or `'workloads[3]'`.
 */

export type Validation<T = unknown> = {
    message: string | AtLeastOne<{ [K in Locale]: string }>
    'for'?: Forable<T>;
};