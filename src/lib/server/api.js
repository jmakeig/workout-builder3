//import crypto from 'crypto';

/** @typedef {import('$lib/entities').Exercise} Exercise */
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
 * /
/** @type {Exercise[]} */
const exercises = [];

/**
 * @template Entity
 * @param {Entity[keyof Entity]} value
 * @returns {boolean}
 */
function exists(value) {
	if (undefined === value || null === value) return false;
	if ('string' === typeof value) return '' !== value;
	if ('number' === typeof value) return !Number.isNaN(value);
	return true;
}

/**
 *
 * @param {FormInput<Exercise>} input
 * @returns {Promise<Result<FormInput<Exercise>, Exercise, 'exercise'>>}
 */
export async function create_exercise(input) {
	/** @type {Validation<Exercise>[]} */
	const validations = [];
	console.log('create_exercise', input);
	if (!exists(input.name)) validations.push({ message: 'Name is required', for: 'name' });
	if (!exists(input.label)) validations.push({ message: 'Label is required', for: 'label' });

	if (validations.length > 0) {
		return Promise.resolve({ exercise: input, validations });
	}
	const exercise = /** @type {Exercise} */ ({ id: crypto.randomUUID(), ...input });
	exercises.push(exercise);
	return Promise.resolve(exercise);
}
