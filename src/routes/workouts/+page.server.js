import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const workouts = await api.get_workouts();
	return { workouts };
}
