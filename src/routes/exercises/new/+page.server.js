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


/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {};
};


/** @satisfies {import('./$types').Actions} */
export const actions = {
    create: async ({ request }) => {
        const exercise = /** @type {FormInput<Exercise>} */ (Object.fromEntries(await request.formData()));
        console.log(exercise);
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