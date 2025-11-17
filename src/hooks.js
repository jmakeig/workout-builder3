import { Validation } from '$lib/validation';

/** @type {import('@sveltejs/kit').Transport} */
export const transport = {
	Validation: {
		encode: (validation) => validation instanceof Validation && validation.issues(),
		decode: (validation) => Validation.fromJSON(validation)
	}
};
