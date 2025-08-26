import * as api from '$lib/server/api';
import { fail } from '@sveltejs/kit';


/**
 * @template Entity
 * @typedef {import('$lib/util').FormInput<Entity>} FormInput
 */
/**
 * @template Entity 
 * @typedef {import('$lib/util').Validation<Entity>} Validation
*/
/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {import('$lib/util').Result<In, Out, Prop>} Result 
 */
/**
* @template In, Out
* @template {string} [Prop = "input"]
* @typedef {import('$lib/util').InvalidResult<In, Out, Prop>} InvalidResult 
*/
/** @typedef {import('$lib/entities').Exercise} Exercise */


/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {};
};

/**
 * 
 * @param {Result<FormInput<Exercise>, Exercise, 'exercise'>} result 
 * @returns {result is InvalidResult<FormInput<Exercise>, Exercise, 'exercise'>}
 */
function is_invalid(result) {
    return ('validations' in Object(result));
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    create: async ({ request }) => {
        const exercise_input = /** @type {FormInput<Exercise>} */ (Object.fromEntries(await request.formData()));

        const exercise = await api.create_exercise(exercise_input);

        // Careful with the params. The message sent back in the `form` or the `fail`
        // needs to be an object with an `exercise` property (well, `Prop`).
        if (is_invalid(exercise)) return fail(400, exercise);
        return { exercise };
    }
};