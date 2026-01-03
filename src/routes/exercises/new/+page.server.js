import * as api from '$lib/server/api';
import { fail } from '@sveltejs/kit';
import { is_invalid } from '$lib/validation';
import { from_entries } from '$lib/forms';

/** @typedef {import('$lib/entities').Exercise} Exercise */
/** @typedef {import('$lib/entities').PendingExercise} PendingExercise */

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		exercises: await api.get_exercises()
	};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const input = /** @type {PendingExercise} */ ({
			exercise: null,
			name: data.get('name'),
			label: data.get('label'),
			description: data.get('description'),
			instructions: data.get('instructions'),
			alternatives: data
				.getAll('alternatives[]')
				// asdf
				.map((alternative) => ({
					exercise: alternative
				}))
		});

		// console.log('Pending<Exercise>', input);
		const exercise = await api.create_exercise(input);

		// Careful with the params. The message sent back in the `form` or the `fail`
		// needs to be an object with an `exercise` property (well, `Prop`).
		if (is_invalid(exercise))
			return console.log(exercise.validation.toString()) ?? fail(422, exercise);
		return { exercise };
	}
};
