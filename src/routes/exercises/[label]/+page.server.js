import { error } from '@sveltejs/kit';
import * as api from '$lib/server/api';
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const exercise = await api.find_exercise(params.label);
	if (null === exercise) return error(404, `Exercise “${params.label}” not found`);
	return { exercise };
}
