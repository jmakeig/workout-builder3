export type FormInput<T> = {
	[p in keyof T]: T[p] | null | string; // | FormDataEntryValue
};

/**
 * Allow all properties in `T` to be `null` or `string` along with the property’s original type.
 * This is useful when you populate an entity from `FormData`, for example,
 * which returns `string` or `null` (or `File`). You’d populate a “loose” instance of the entity,
 * submit it for processing, and get back the strongly typed kind, or validation errors.
 */
export type Loosen<T> = {
	[p in keyof T]: T[p] | null | string;
};

/**
 * For the properties in `T`, ignore the ones that match `U` by types.
 */
export type OmitMatch<Type, Union> = {
	[K in keyof Type as Type[K] extends Union ? never : K]: Type[K];
};

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
	[K in keyof T]-?: Pick<T, K> & Partial<T>;
}[keyof T];

// type Locale = 'en' | 'fr';
/**
 * Allows you to reference any key of `Entity` by name,
 * as well as an optional offset for `Array` properties.
 *
 * @example
 * Forable<{a: string; b: Array<number>}> // 'a' | 'b' | 'b[#]', where # is any number
 */

// type Forable<Entity> =
// 	| `${string & keyof Entity}`
// 	| `${string & keyof PickMatch<Entity, Array<unknown>>}[${number}]`;
/**
 * A validation message. Typical usage is for communicating business rule violations
 * back to users. `for` can optionally reference a property in the entity being validated by name,
 * e.g. `'id'` or `'workloads[3]'`.
 */

// export type Validation<Entity = unknown> = {
// 	readonly message: string | AtLeastOne<{ [K in Locale]: string }>;
// 	// for?: Forable<Entity>;
// 	readonly path?: Path;
// };

// export type Path = ReadonlyArray<PropertyKey>;

/**
 * A response to an API call. A response can either be the plain output entity, `Out`,
 * or a validation error wrapper around the input, `In`, plus a collection of `Validation`
 * instances. `Prop` allows you to
 * name the property on the `InvalidResult` instance to access the input entity,
 * e.g. `result.customer` versus the default, `result.input`.
 *
 * This means that APIs should *not* throw `Error`s for business rule violations.
 * Validation is an expected part of the API contract and thus is modeled in the
 * responses from API calls. Thrown errors should represent exceptional circumstances.
 */
// export type MaybeInvalid<In, Out, Prop extends string = 'input'> = Out | Invalid<In, Out, Prop>;

/**
 * A way to communicate a business rule violation in an API call.
 */
// export type Invalid<In, Out, Prop extends string = 'input'> = {
// 	validations: Array<Validation<Out>>;
// } & {
// 	[property in Prop]: In;
// };
