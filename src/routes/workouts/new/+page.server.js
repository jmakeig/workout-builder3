import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import * as api from '$lib/server/api';
import { is_invalid } from '$lib/validation';

/** @typedef {import('$lib/entities').Workout} Workout */
/** @typedef {import('$lib/entities').PendingWorkout} PendingWorkout */

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	create: async ({ request }) => {
		const workout_input = /** @type {PendingWorkout} */ (
			Object.fromEntries(await request.formData())
		);

		const workout = await api.create_workout(workout_input);

		// Careful with the params. The message sent back in the `form` or the `fail`
		// needs to be an object with an `exercise` property (well, `Prop` constant).
		if (is_invalid(workout)) return fail(400, workout);
		//return { workout };
		return redirect(303, `/workouts/${workout.label}`);
	}
};
