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
 *
 * @param {Result<any, any, string>} result
 * @returns {result is InvalidResult<any, any, string>}
 */
export function is_invalid(result) {
	return 'validations' in Object(result);
}
