import * as api from '$lib/server/api';
import { fail } from '@sveltejs/kit';
import { is_invalid } from '$lib/validation';

/** @typedef {import('$lib/entities').Exercise} Exercise */
/** @typedef {import('$lib/entities').PendingExercise} PendingExercise */

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		exercises: await api.get_exercises()
	};
}

/**
 *
 * @param {FormData} form_data
 * @reutrn {Record<string, unknown>}
 */
function from_entries(form_data) {
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

/** @satisfies {import('./$types').Actions} */
export const actions = {
	create: async ({ request }) => {
		const input =
			/** @type {PendingExercise} */
			(Object.fromEntries(await request.formData()));
		input.alternatives = console.warn('exercise.alternatives not yet implemented') ?? null;
		const exercise = await api.create_exercise(input);

		// Careful with the params. The message sent back in the `form` or the `fail`
		// needs to be an object with an `exercise` property (well, `Prop`).
		if (is_invalid(exercise))
			return console.log(exercise.validation.toString()) ?? fail(422, exercise);
		return { exercise };
	}
};
