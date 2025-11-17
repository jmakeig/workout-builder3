import type { AtLeastOne } from '$lib/util';
import { Validation } from './validation.js';

type Locale = 'en' | 'fr';

/**
 * A validation message. Typical usage is for communicating business rule violations
 * back to users. `for` can optionally reference a property in the entity being validated by name,
 * e.g. `'id'` or `'workloads[3]'`.
 */
export type Issue<Entity = unknown> = {
	readonly message: string | AtLeastOne<{ [K in Locale]: string }>;
	// for?: Forable<Entity>;
	readonly path?: Path;
};

export type Path = ReadonlyArray<PropertyKey>;

/**
 * A way to communicate a business rule violation in an API call.
 */
export type Invalid<In, Out, Prop extends string = 'input'> = {
	//validations: Array<Validation<Out>>;
	validation: Validation<Out>;
} & {
	[property in Prop]: In;
};

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
export type MaybeInvalid<In, Out, Prop extends string = 'input'> = Out | Invalid<In, Out, Prop>;

/*
type Forable<Entity> =
    | `${string & keyof Entity}`
    | `${string & keyof PickMatch<Entity, Array<unknown>>}[${number}]`;
*/
