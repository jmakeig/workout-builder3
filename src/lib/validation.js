// https://stackblitz.com/edit/sveltejs-kit-template-default-b5zbxomg?file=src%2Flib%2FUser.svelte.js

/**
 * @typedef {import('./validation-types').Issue} Issue
 * @typedef {import('./validation-types').Path} Path
 */

/**
 * @template Out
 */
export class Validation {
	/** @type {Issue[]} */
	#issues = [];
	/**
	 */
	constructor() {}
	/**
	 *
	 * @param {Issue['message']} message
	 * @param {PropertyKey | Path} [property]
	 * @returns {Validation<Out>}
	 */
	add(message, property) {
		console.log('Validation.add', message, property);
		this.#issues.push({
			message,
			path: property ? [...(Array.isArray(property) ? property : [property])] : []
		});
		return this;
	}
	/**
	 *
	 * @param {Validation<unknown>} validation
	 * @param {Path} [base_path = []]
	 * @returns {Validation<Out>}
	 */
	merge(validation, base_path = []) {
		for (const issue of validation) {
			this.#issues.push({
				message: issue.message,
				path: [...base_path, ...(issue.path ?? [])]
			});
		}
		return this;
	}
	/**
	 * @param {Path} [path]
	 * @returns {ReadonlyArray<Issue>}
	 */
	issues(path) {
		if (undefined === path) return this.#issues;
		return this.#issues.filter((issue) => {
			if (path.length !== issue.path?.length) return false;
			for (let i = 0; i < path.length; i++) {
				if (path[i] !== issue.path?.[i]) return false;
			}
			return true;
		});
	}
	/**
	 *
	 * @param {number} index
	 * @returns {Issue | undefined}
	 */
	get(index) {
		if (index < 0 || index >= this.#issues.length) return undefined;
		return this.#issues[index];
	}
	/**
	 *
	 * @param {Path} [path]
	 * @returns {Issue | undefined}
	 */
	first(path) {
		return this.issues(path)[0];
	}
	/**
	 *
	 * @param {Path} [path]
	 * @returns {boolean}
	 */
	has(path) {
		return this.issues(path).length > 0;
	}
	/**
	 * Equivalent to calling `validate` on each of the items in the `collection` and
	 * then `merge` on any invalid results. Returns the original `collection` if _any_
	 * of the items is invalid or a collection of the validated items if _all_ of them
	 * are valid.
	 *
	 * TODO: Support other collection types besides `Array`.
	 *
	 * @template In, Out
	 * @param {Array<In>} collection
	 * @template {string} [Prop = "input"]
	 * @param {(item: In) => MaybeInvalid<In, Out, Prop>} validate
	 * @param {Path} [base_path = []]
	 * @returns {Array<In | Out>}
	 */
	collect(collection, validate, base_path = []) {
		let dirty = false;
		const output = collection.map((item, index) => {
			const result = validate(item);
			if (is_invalid(result)) {
				dirty = true;
				this.merge(result.validation, [...base_path, index]);
				return item;
			}
			return result;
		});
		if (dirty) return collection;
		return output;
	}
	/**
	 *
	 * @returns {object}
	 */
	toJSON() {
		return this.#issues;
	}
	/**
	 *
	 * @param {any} json
	 * @returns {Validation<unknown>}
	 */
	static fromJSON(json) {
		return new Validation().merge(json);
	}
	is_valid() {
		return !this.has();
	}
	[Symbol.iterator]() {
		return this.#issues[Symbol.iterator]();
	}
	get length() {
		return this.#issues.length;
	}
	toString() {
		return this.#issues
			.map((issue) => `${issue.message} (${issue.path ? issue.path.join(' > ') : ''})`)
			.join('\n');
	}
}

/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {import('$lib/validation-types').Invalid<In, Out, Prop>} Invalid
 */

/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {import('$lib/validation-types').MaybeInvalid<In, Out, Prop>} MaybeInvalid
 */

/**
 * Checks whether a `MaybeInvalid` result is actually `Invalid`.
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @param {MaybeInvalid<In, Out, Prop>} result
 * @returns {result is Invalid<In, Out, Prop>}
 */
export function is_invalid(result) {
	return (
		'object' === typeof result &&
		null !== result &&
		'validation' in result &&
		result.validation instanceof Validation
	);
}
