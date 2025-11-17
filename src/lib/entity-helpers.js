/**
 * @typedef {import('$lib/entities').ID} ID
 * @typedef {import('$lib/entities').Workout} Workout
 * @typedef {import('$lib/entities').PendingWorkout} PendingWorkout
 * @typedef {import('$lib/entities').Set} Set
 * @typedef {import('$lib/entities').Activity} Activity
 * @typedef {import('$lib/entities').Exercise} Exercise
 */

/**
 * @typedef {import('$lib/validation').Path} Path
 */

/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {import('$lib/validation-types').MaybeInvalid<In, Out, Prop>} MaybeInvalid
 */

import { Validation, is_invalid } from '$lib/validation';

/**
 *
 * @param {unknown} value
 * @returns {MaybeInvalid<unknown, Workout, 'workout'>}
 */
export function validate_workout(value) {
	/** @type {Validation<Workout>} */
	const validation = new Validation();
	const workout = structuredClone(value);

	// Existence
	if ('object' === typeof workout && null !== workout) {
		// Property type
		if ('name' in workout && 'string' === typeof workout.name) {
			// Property constraints
			if (3 > workout.name.length) {
				validation.add('Workout name must at least 3 letters.', 'name');
			}
		} else {
			validation.add('Workout name must be text', 'name');
		}
		// Property type
		if ('label' in workout && 'string' === typeof workout.label) {
			// Property constraints
			if (3 > workout.label.length) {
				validation.add('Workout label must at least 3 letters.', 'label');
			} else {
				if ('new' === workout.label) {
					validation.add('Exercise label cannot be “new”.', 'label');
				}
			}
		} else {
			validation.add('Workout label must be text', 'label');
		}
		// Property type
		if (
			'description' in workout &&
			('string' === typeof workout.description || null === workout.description)
		) {
			// No constraints
		} else {
			validation.add('Workout description invalid', 'description');
		}
		if ('sets' in workout && Array.isArray(workout.sets)) {
			for (let s = 0; s < workout.sets.length; s++) {
				const set = validate_set(workout.sets[s]);
				if (is_invalid(set)) {
					validation.merge(set.validation, ['sets', s]);
				} else {
					workout.sets[s] = set;
				}
			}
		} else {
			validation.add('Workout sets must exist.', 'sets');
		}
	} else {
		validation.add('Workout must exist.');
	}
	if (validation.is_valid()) return /** @type {Workout} */ (workout);
	return {
		workout: value,
		validation
	};
}

/**
 *
 * @param {unknown} value
 * @returns {MaybeInvalid<unknown, Set, 'set'>}
 */
export function validate_set(value) {
	/** @type {Validation<Set>} */
	const validation = new Validation();
	const set = structuredClone(value);

	// Existence
	if ('object' === typeof set && null !== set && Array.isArray(set)) {
		for (let a = 0; a < set.length; a++) {
			const activity = validate_activity(set[a]);
			if (is_invalid(activity)) {
				validation.merge(activity.validation, [a]);
			} else {
				set[a] = activity;
			}
		}
	} else {
		validation.add('Set must exist.');
	}

	if (validation.is_valid()) return /** @type {Set} */ (set);
	return {
		set: value,
		validation
	};
}

/**
 * @param {unknown} value Probably a PendingActivity
 * @returns {MaybeInvalid<unknown, Activity, 'activity'>}
 */
export function validate_activity(value) {
	/** @type {Validation<Activity>} */
	const validation = new Validation();
	const activity = structuredClone(value);

	// Existence
	if ('object' === typeof activity && null !== activity) {
		if ('exercise' in activity || 'rest' in activity) {
			if ('exercise' in activity) {
				const exercise = validate_exercise(activity.exercise);
				if (is_invalid(exercise)) {
					validation.merge(exercise.validation, ['exercise']);
				} else {
					activity.exercise = exercise;
				}
			}
			if ('rest' in activity) {
				// No constraints
			}
			if (
				'duration' in activity &&
				'number' === typeof activity.duration &&
				!Number.isNaN(activity.duration)
			) {
				if (0 >= activity.duration) {
					validation.add('Activity duration must be positive.', 'duration');
				}
			} else {
				validation.add('Activity duration must be a number.', 'duration');
			}
		} else {
			validation.add('Activity must be exercise or rest.', 'activity');
		}
	} else {
		validation.add('Activity must exist.');
	}

	if (validation.is_valid()) return /** @type {Activity} */ (activity);
	return {
		activity: activity,
		validation
	};
}

/**
 * @param {unknown} value Probably a PendingExercise
 * @returns {MaybeInvalid<unknown, Exercise, 'exercise'>}
 */
export function validate_exercise(value) {
	/** @type {Validation<Exercise>} */
	const validation = new Validation();
	const exercise = structuredClone(value);

	// Existence
	if ('object' === typeof exercise && null !== exercise) {
		// Property type
		if ('name' in exercise && 'string' === typeof exercise.name) {
			// Property constraints
			if (3 > exercise.name.length) {
				validation.add('Exercise name must at least 3 letters.', 'name');
			}
		} else {
			validation.add('Exercise name must be text', 'name');
		}
		// Property type
		if ('label' in exercise && 'string' === typeof exercise.label) {
			// Property constraints
			if (3 > exercise.label.length) {
				validation.add('Exercise label must at least 3 letters.', 'label');
			} else {
				if ('new' === exercise.label) {
					validation.add(`Exercise label cannot be “new”.`, 'label');
				}
			}
		} else {
			validation.add('Exercise label must be text', 'label');
		}
		// Property type
		if (
			'description' in exercise &&
			('string' === typeof exercise.description || null === exercise.description)
		) {
			// No constraints
		} else {
			validation.add('Exercise description invalid', 'description');
		}
		if ('instructions' in exercise) {
			if (null === exercise.instructions) {
				// OK
			} else {
				if ('string' === typeof exercise.instructions) {
					// Parse and fall through
					exercise.instructions = exercise.instructions.split('\n');
				}
				if (Array.isArray(exercise.instructions)) {
					for (let i = 0; i < exercise.instructions.length; i++) {
						if ('string' === typeof exercise.instructions[i]) {
							exercise.instructions[i] = exercise.instructions[i].trim();
						} else {
							validation.add('Exercise instruction must be text.', ['instructions', i]);
						}
					}
					exercise.instructions.forEach((instruction, i) => {
						if ('string' !== typeof instruction) {
							validation.add('Exercise instruction must be text.', ['instructions', i]);
						}
					});
				} else {
					validation.add('Exercise instructions must exist.', 'instructions');
				}
			}
		} else {
			validation.add('Exercise instructions must exist.', 'instructions');
		}
		if ('alternatives' in exercise) {
			if (null === exercise.alternatives) {
				// OK
			} else if (Array.isArray(exercise.alternatives)) {
				for (let a = 0; a < exercise.alternatives.length; a++) {
					const alternative = validate_exercise(exercise.alternatives[a]);
					if (is_invalid(alternative)) {
						validation.merge(alternative.validation, ['alternatives', a]);
					} else {
						exercise.alternatives[a] = alternative;
					}
				}
			} else {
				validation.add('Alternatives can only be exercises.', 'alternatives');
			}
		} else {
			validation.add('Exercise alternatives must exist.', 'alternatives');
		}
	} else {
		validation.add('Exercise must exist.');
	}

	if (validation.is_valid()) return /** @type {Exercise} */ (exercise);
	return {
		exercise: value,
		validation
	};
}

/**
 *
 * @returns {ID}
 */
export function new_id() {
	return /** @type {ID} */ (crypto.randomUUID());
}
