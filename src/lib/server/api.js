import { validate_exercise, validate_workout, new_id } from '$lib/entity-helpers';
import { is_invalid } from '$lib/validation';

/** @typedef {import('$lib/entities').ID} ID */
/** @typedef {import('$lib/entities').Exercise} Exercise */
/** @typedef {import('$lib/entities').PendingExercise} PendingExercise */
/** @typedef {import('$lib/entities').Workout} Workout */
/** @typedef {import('$lib/entities').PendingWorkout} PendingWorkout */

/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {import('$lib/validation-types').MaybeInvalid<In, Out, Prop>} MaybeInvalid
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
	const exercise = validate_exercise({ ...input, exercise: new_id() });

	if (is_invalid(exercise)) {
		return Promise.resolve({ exercise: input, validation: exercise.validation });
	}

	exercises.push(exercise);
	return Promise.resolve(exercise);
}

/**
 * @param {PendingWorkout} input
 * @returns {Promise<MaybeInvalid<PendingWorkout, Workout, 'workout'>>}
 */
export async function create_workout(input) {
	const workout = validate_workout({
		...input,
		workout: new_id(),
		sets: input.sets || [] // Assumes that the initial creation does not set this
	});

	if (is_invalid(workout)) {
		return Promise.resolve({ workout: input, validation: workout.validation });
	}

	workouts.push(workout);
	return Promise.resolve(workout);
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
