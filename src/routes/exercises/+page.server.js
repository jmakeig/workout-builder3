import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { exercises: await api.get_exercises() };
}
