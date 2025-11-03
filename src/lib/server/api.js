import { is_valid_exercise, new_id, workout_schema } from '$lib/entity-helpers';
import { has } from '$lib/validation';

/** @typedef {import('$lib/entities').ID} ID */
/** @typedef {import('$lib/entities').Exercise} Exercise */
/** @typedef {import('$lib/entities').PendingExercise} PendingExercise */
/** @typedef {import('$lib/entities').Workout} Workout */
/** @typedef {import('$lib/entities').PendingWorkout} PendingWorkout */
/**
 * @template Entity
 * @typedef {import('$lib/util').Validation<Entity>} Validation
 */

/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {import('$lib/util').Result<In, Out, Prop>} Result 
 * /

/** @type {Workout[]} */
const workouts = [];
/** @type {Exercise[]} */
const exercises = [
	{
		exercise: /** @type {ID} */ ('1'),
		name: 'Push Up',
		label: 'push-up',
		description: null,
		instructions: null,
		alternatives: null
	},
	{
		exercise: /** @type {ID} */ ('2'),
		name: 'Sit Up',
		label: 'sit-up',
		description: null,
		instructions: null,
		alternatives: null
	},
	{
		exercise: /** @type {ID} */ ('3'),
		name: 'Squat',
		label: 'squat',
		description: null,
		instructions: null,
		alternatives: null
	}
];

/**
 * @template T
 * @param {T} value
 * @returns {value is NonNullable<T>}
 */
function exists(value) {
	if (undefined === value || null === value) return false;
	if ('string' === typeof value) return '' !== value;
	if ('number' === typeof value) return !Number.isNaN(value);
	return true;
}

/**
 *
 * @param {PendingExercise} input
 * @returns {Promise<Result<PendingExercise, Exercise, 'exercise'>>}
 */
export async function create_exercise(input) {
	/** @type {Validation<Exercise>[]} */
	const validations = [];

	if (!exists(input.name)) validations.push({ message: 'Name is required', for: 'name' });
	if (!exists(input.label)) validations.push({ message: 'Label is required', for: 'label' });

	if (!is_valid_exercise(input)) {
		return Promise.resolve({ exercise: input, validations: [{ message: 'TODO: Nope!' }] });
	}
	const exercise = { ...input, exercise: new_id() };
	exercises.push(exercise);
	return Promise.resolve(exercise);
}

/**
 * @param {PendingWorkout} input
 * @returns {Promise<Result<PendingWorkout, Workout, 'workout'>>}
 */
export async function create_workout(input) {
	/** @type {Validation<Workout>[]} */
	const validations = [];

	const schema = workout_schema();
	const validation_result = schema['~standard'].validate(input);

	if (!exists(input.name)) validations.push({ message: 'Name is required', for: 'name' });
	if (!exists(input.label)) validations.push({ message: 'Label is required', for: 'label' });

	if (has(validations)) {
		return Promise.resolve({ workout: input, validations });
	}
	const workout = /** @type {Workout} */ ({
		...input,
		workout: crypto.randomUUID(),
		sets: input.sets || [] // Assumes that the initial creation does not set this
	});
	workouts.push(workout);
	return Promise.resolve(workout);
}

/**
 *
 * @param {Workout['label']} label
 * @returns {Promise<Workout | null>}
 */
export async function find_workout(label) {
	const result = workouts.find((workout) => workout.label === label);
	return Promise.resolve(result || null);
}

/**
 * @returns {Promise<Record<Exercise['label'], Exercise>>}
 */
export async function get_exercises() {
	return Promise.resolve(Object.fromEntries(exercises.map((e) => [e.label, e])));
}
