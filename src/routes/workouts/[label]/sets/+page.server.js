import { error } from '@sveltejs/kit';
import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const workout = await api.find_workout(params.label);
	if (null === workout) return error(404, `Workout ${params.label} not found`);
	return {
		label: params.label,
		workout
	};
}
