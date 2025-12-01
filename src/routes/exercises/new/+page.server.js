import * as api from '$lib/server/api';
import { fail } from '@sveltejs/kit';
import { is_invalid } from '$lib/validation';

/** @typedef {import('$lib/entities').Exercise} Exercise */
/** @typedef {import('$lib/entities').PendingExercise} PendingExercise */

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	create: async ({ request }) => {
		const input =
			/** @type {PendingExercise} */
			({
				...Object.fromEntries(await request.formData()),
				alternatives: console.warn('Exercise.alternatives not implemented yet') ?? null
			});
		const exercise = await api.create_exercise(input);

		// Careful with the params. The message sent back in the `form` or the `fail`
		// needs to be an object with an `exercise` property (well, `Prop`).
		if (is_invalid(exercise)) return fail(422, exercise);
		return { exercise };
	}
};
