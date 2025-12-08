/**
 * TODO: Extract
 * @param {FormData} form_data
 * @returns {Record<string, unknown>}
 */
export function from_entries(form_data) {
	/** @type {Record<string, unknown>} */
	const out = {};
	for (const [key, value] of form_data.entries()) {
		if (out.hasOwnProperty(key)) {
			if (Array.isArray(out[key])) {
				out[key].push(value);
			} else {
				out[key] = [out[key], value];
			}
		} else {
			out[key] = value;
		}
	}
	return out;
}
