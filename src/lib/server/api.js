import { validate_pending_exercise, validate_workout, new_id } from '$lib/entity-helpers';
import { is_invalid, Validation } from '$lib/validation';

/**
 * @template Entity
 * @typedef {import('$lib/entity-utils').Pending<Entity>} Pending
 */
/**
 * @typedef {import('$lib/entity-utils').ID} ID
 * @typedef {import('$lib/entities').Workout} Workout
 * @typedef {import('$lib/entities').PendingWorkout} PendingWorkout
 * @typedef {import('$lib/entities').Set} Set
 * @typedef {import('$lib/entities').Activity} Activity
 * @typedef {import('$lib/entities').Exercise} Exercise
 */

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
 * @template T
 * @param {T} value
 * @param {number} [ms]
 * @returns Promise<T>
 */
function delay(value, ms) {
	return new Promise((resolve) => setTimeout(resolve, ms ?? Math.random() * 1000)).then(() =>
		Promise.resolve(value)
	);
}

/**
 *
 * @param {Pending<Exercise>} input
 * @returns {Promise<MaybeInvalid<Pending<Exercise>, Exercise, 'exercise'>>}
 */
export async function create_exercise(input) {
	const exercise = validate_pending_exercise({ ...input, exercise: new_id() });

	if (is_invalid(exercise)) {
		return Promise.resolve({ exercise: input, validation: exercise.validation });
	}

	// Label uniqueness
	// With a database you’d probably catch a unique constraint violation
	if (exercises.find((ex) => ex.label === exercise.label)) {
		return Promise.resolve({
			exercise: input,
			validation: /** @type {Validation<Exercise>} */ (new Validation()).add(
				'Exercise label must be unique',
				'label'
			)
		});
	}

	exercises.push(exercise);
	return delay(exercise);
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
	return delay(workout);
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
	return delay(workouts);
}

/**
 *
 * @param {Workout['label']} label
 * @returns {Promise<Workout | null>}
 */
export async function find_workout(label) {
	const result = workouts.find((workout) => workout.label === label);
	return delay(result || null);
}

/**
 * @returns {Promise<Record<Exercise['label'], Exercise>>}
 */
export async function get_exercises() {
	return delay(Object.fromEntries(exercises.map((e) => [e.label, e])));
}

/**
 *
 * @param {Workout['label']} label
 * @returns {Promise<Exercise | null>}
 */
export async function find_exercise(label) {
	const result = exercises.find((exercise) => exercise.label === label);
	return delay(result || null);
}
