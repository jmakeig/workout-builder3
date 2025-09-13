import { error } from '@sveltejs/kit';
import * as api from '$lib/server/api';
import { is_invalid, to_string } from '$lib/validation';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const workout = await api.find_workout(params.label);
	if (null === workout) return error(404, `Workout ${params.label} not found`);
	if (is_invalid(workout)) return error(500, workout.validations.map((v) => v.message).join(', '));
	const exercises = await api.get_exercises();
	if (is_invalid(exercises)) return error(500, to_string(exercises.validations));
	return {
		label: params.label,
		workout,
		exercises
	};
}
