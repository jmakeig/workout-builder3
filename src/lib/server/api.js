import { is_valid_exercise, is_valid_workout, new_id } from '$lib/entity-helpers';
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
 * @typedef {import('$lib/util').MaybeInvalid<In, Out, Prop>} MaybeInvalid
 */

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
 *
 * @param {PendingExercise} input
 * @returns {Promise<MaybeInvalid<PendingExercise, Exercise, 'exercise'>>}
 */
export async function create_exercise(input) {
	/** @type {Validation<Exercise>[]} */
	const validations = [];

	const exercise = { ...input, exercise: new_id() };
	if (is_valid_exercise(exercise)) {
		exercises.push(exercise);
		return Promise.resolve(exercise);
	}

	return { exercise, validations };
}

/**
 * @param {PendingWorkout} input
 * @returns {Promise<MaybeInvalid<PendingWorkout, Workout, 'workout'>>}
 */
export async function create_workout(input) {
	const workout = {
		...input,
		workout: new_id(),
		sets: input.sets || [] // Assumes that the initial creation does not set this
	};
	/** @type {Validation<Workout>[]} */
	const validations = [];
	if (is_valid_workout(workout, (issues) => validations.push(...issues))) {
		workouts.push(workout);
		return Promise.resolve(workout);
	}
	return { workout, validations };
}

/**
 * @param {{with_exercises: Exercise['label'][]}} [params]
 * @returns {Promise<Workout[]>}
 */
export async function get_workouts(params) {
	if (params && 'with_exercises' in params) {
		return workouts.filter((workout) => {
			for (const set of workout.sets) {
				for (const activity of set) {
					if ('exercise' in activity && params.with_exercises.includes(activity.exercise.label)) {
						return true;
					}
				}
			}
			return false;
		});
	}
	return Promise.resolve(workouts);
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

/**
 *
 * @param {Workout['label']} label
 * @returns {Promise<Exercise | null>}
 */
export async function find_exercise(label) {
	const result = exercises.find((exercise) => exercise.label === label);
	return Promise.resolve(result || null);
}
