/*** Utilities ***/
declare const IDBrand: unique symbol;
/**
 * Branded type for use as an identifier for an entity. An entity should
 * have exactly one property of this type.
 * @see IDPropertyKey
 * @see IsEntity
 */
export type ID = string & { [IDBrand]: void };
/**
 * Uses the property in `Entity` that is of type `ID`.
 */
type Ref<Entity> = {
	[P in IDPropertyKey<Entity>]: ID; // Use entity’s ID key name, not general `ref`
};

/**
 * The `string` key name of the property of `Entity` that is *exactly* of type `ID`.
 */
type IDPropertyKey<Entity> = {
	[K in keyof Entity]: Entity[K] extends ID
		? [ID] extends [Entity[K]]
			? K
			: never // Clever exact match trick
		: never;
}[keyof Entity];

/**
 * Union type for all non-object types. Does not include `Array`.
 */
type Primitive = string | number | bigint | boolean | symbol | null | undefined;
/**
 * `boolean` check that `T` is not `ID`, but is a `Primitive`
 */
type IsPrimitive<T> = T extends ID ? false : T extends Primitive ? true : false;
/**
 * `boolean` check that `T` is an `Array`
 */
type IsArray<T> = T extends Array<any> ? true : false;

/**
 * An `Entity` is not a `Primitive` or and `Array` and it has a property of type `ID` (`IDPropertyKey<Entity>`)
 */
type IsEntity<Entity> =
	IsPrimitive<Entity> extends true
		? false
		: IsArray<Entity> extends true
			? false
			: IDPropertyKey<Entity> extends never
				? false
				: true;

/**
 * Applies the `Ref` mapping logic to each element of an `Array`
 */
type TransformArray<T> =
	T extends Array<infer U>
		? Array<U extends object ? (IsEntity<U> extends true ? Ref<U> | null : Pending<U>) : U>
		: T;

/**
 * Special casing for tranforming `Entity` types that aren’t nullable
 */
type TransformNonNullable<Entity> = IsEntity<Entity> extends true ? Ref<Entity> : Pending<Entity>;

/**
 * Special handling to retain nullabiltiy on `Ref`s
 */
type TransformForeignRef<T> = T extends null //| undefined
	? TransformNonNullable<NonNullable<T>> | null // Transform non-nullable part, then re-apply null | undefined
	: TransformNonNullable<T>; // Transform directly if not nullable

/**
 * Loosens an `Entity` type to allow:
 *   * References to other entities, rather than having to fully instantiate them
 *   * Nullable `ID` keys, for example, for the case of a new instance that doesn’t have an identifier yet
 *   * Primitive values can use the strong type as well as `string` or `null`, for example when mapping from `FormData`
 */
export type Pending<Entity> =
	Entity extends Array<any>
		? TransformArray<Entity>
		: {
				[K in keyof Entity]: K extends IDPropertyKey<Entity> // Rule 1: Primary ID property
					? ID | null
					: // Rule 4: Array properties (must be second)
						Entity[K] extends Array<any>
						? TransformArray<Entity[K]>
						: // Rule 2: Primitive handling
							Entity[K] extends Primitive // Numbers become number | null
							? Entity[K] | string | null
							: // Rule 3 (and final fall-through): Entity/Object reference transformation
								TransformForeignRef<Entity[K]>;
			};
