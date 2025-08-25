import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {};
};

/**
 * @param {FormData} form_data
 * @param {string} name
 * @returns {string | null}
 */
function get_string(form_data, name) {
    const fde = form_data.get(name);
    if (null === fde) return null;
    return String(fde);
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    create: async ({ request }) => {
        const form_data = await request.formData();
        /** @type {import('$lib/util').FormInput<import('$lib/entities').Exercise>} */
        const exercise = {
            name: form_data.get('name'),
            label: form_data.get('label'),
            description: form_data.get('description'),
            instructions: form_data.get('instructions'),
            alternatives: null
        };
        console.log('presubmit', exercise);
        return fail(400, { exercise });
    }
};