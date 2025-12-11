/**
 * TODO: Extract
 * @param {FormData} form_data
 * @param {(entity: Record<string, unknown>) => Record<string, unknown>} [postprocess]
 * @returns {Record<string, unknown>}
 */
export function from_entries(form_data, postprocess = (entity) => entity) {
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
	return postprocess(out);
}
