/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {import('$lib/util').Result<In, Out, Prop>} Result
 */
/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {import('$lib/util').InvalidResult<In, Out, Prop>} InvalidResult
 */
/**
 * @template Entity
 * @typedef {import("./util").Validation<Entity>} Validation
 */

/**
 * @typedef {import('./util').Path} Path
 */

/**
 *
 * @param {Result<any, any, string>} result
 * @returns {result is InvalidResult<any, any, string>}
 */
export function is_invalid(result) {
	return 'validations' in Object(result);
}

/**
 * Filter by name.
 *
 * @template Entity
 * @param {Validation<Entity>[]} [validations]
 * @param {string} [name]
 * @returns {Validation<Entity>[] | undefined}
 */
export function by(validations, name) {
	if (undefined === validations) return undefined;
	if (undefined === name) return validations;
	return validations.filter((v) => name === path_for(v.path));
}

/**
 * @param {Path} [path]
 * @returns {string | undefined}
 */
export function path_for(path) {
	if (undefined === path) return undefined;
	return path.reduce((/** @type {string} */ acc, segment) => {
		if ('number' === typeof segment) {
			return `${acc}[${segment}]`;
		} else if ('symbol' === typeof segment) {
			return `${acc}["${String(segment)}"]`;
		} else {
			if ('' === acc) {
				return String(segment);
			} else {
				return `${acc}.${String(segment)}`;
			}
		}
	}, '');
}

/**
 * Validations that don’t have a specific name,
 * i.e. that aren’t tied to a field.
 *
 * @template Entity
 * @param {Validation<Entity>[]} [validations]
 * @returns {Validation<Entity>[] | undefined}
 */
export function general(validations) {
	if (undefined === validations) return undefined;
	return validations.filter((v) => undefined === v.path);
}

/**
 * @template Entity
 * @param {Validation<Entity>[]} [validations]
 * @param {string} [name]
 * @returns {Validation<Entity> | undefined}
 */
export function first(validations, name) {
	if (undefined === validations) return undefined;
	const v = by(validations, name);
	if (v) return v[0];
	return undefined;
}
/**
 * Has at least one validation.
 * @template Entity
 * @param {Validation<Entity>[]} [validations]
 * @param {string} [name] Omitted will evaluate all validations, regardless of name
 * @returns {boolean}
 */
export function has(validations, name) {
	return Boolean(first(validations, name));
}
