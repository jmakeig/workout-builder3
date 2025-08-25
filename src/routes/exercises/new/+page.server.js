import { fail } from '@sveltejs/kit';

/**
 * @template Entity
 * @typedef {import('$lib/util').FormInput<Entity>} FormInput
 */
/**
 * @template Entity 
 * @typedef {import('$lib/util').Validation<Entity>} Validation
*/

/** @typedef {import('$lib/entities').Exercise} Exercise */


/** @type {FormInput<Exercise>} */

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {};
};

/** @satisfies {import('./$types').Actions} */
export const actions = {
    create: async ({ request }) => {
        const form_data = await request.formData();
        /** @type {FormInput<Exercise>} */
        const exercise = {
            name: form_data.get('name'),
            label: form_data.get('label'),
            description: form_data.get('description'),
            instructions: form_data.get('instructions'),
            alternatives: null
        };
        /** @type {Validation<FormInput<Exercise>>[]} */
        const validations = [];
        if ('' === exercise.label) {
            validations.push({
                message: 'Label is required',
                for: 'label'
            });
        }
        if (validations.length) return fail(400, { exercise, validations });
        return { exercise };
    }
};