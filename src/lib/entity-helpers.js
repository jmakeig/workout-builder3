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
		let _name; // Typed dependency in .label
		if ('name' in workout && 'string' === typeof workout.name) {
			if (workout.name.length < 3) {
				validation.add('Name must at least 3 letters.', 'name');
			} else {
				_name = workout.name = workout.name.trim();
			}
		} else {
			validation.add('Name must be text.', 'name');
		}
		if ('label' in workout) {
			if (null === workout.label || '' === workout.label) {
				if (_name) workout.label = slug(_name);
				else validation.add('Label depends on a valid name');
			}
			if ('string' === typeof workout.label) {
				if (workout.label.length < 3) {
					validation.add('Label must at least 3 letters.', 'label');
				} else {
					if ('new' === workout.label.toLowerCase()) {
						validation.add('Label cannot be “new”.', 'label');
					} else {
						workout.label = workout.label.trim();
					}
				}
			} else {
				validation.add('Label must be text.');
			}
		} else {
			validation.add('Label must exist.', 'label');
		}
		if (
			'description' in workout &&
			('string' === typeof workout.description || null === workout.description)
		) {
			// No constraints
		} else {
			validation.add('Description must be text.', 'description');
		}
		if ('sets' in workout && Array.isArray(workout.sets)) {
			workout.sets = validation.collect(workout.sets, validate_set, ['sets']);
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
	// const set = structuredClone(value);
	let set = structuredClone(value);

	// Existence
	if ('object' === typeof set && null !== set && Array.isArray(set)) {
		// for (let a = 0; a < set.length; a++) {
		// 	const activity = validate_activity(set[a]);
		// 	if (is_invalid(activity)) {
		// 		validation.merge(activity.validation, [a]);
		// 	} else {
		// 		set[a] = activity;
		// 	}
		// }
		set = validation.collect(set, validate_activity);
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
		let _name; // Typed dependency in .label
		if ('name' in exercise && 'string' === typeof exercise.name) {
			if (exercise.name.length < 3) {
				validation.add('Name must at least 3 letters.', 'name');
			} else {
				_name = exercise.name = exercise.name.trim();
			}
		} else {
			validation.add('Name must be text.', 'name');
		}
		if ('label' in exercise) {
			if (null === exercise.label || '' === exercise.label) {
				if (_name) exercise.label = slug(_name);
				else validation.add('Label depends on a valid name');
			}
			if ('string' === typeof exercise.label) {
				if (exercise.label.length < 3) {
					validation.add('Label must at least 3 letters.', 'label');
				} else {
					if ('new' === exercise.label.toLowerCase()) {
						validation.add('Label cannot be “new”.', 'label');
					} else {
						exercise.label = exercise.label.trim();
					}
				}
			} else {
				validation.add('Label must be text.');
			}
		} else {
			validation.add('Label must exist.', 'label');
		}
		// Property type
		if ('description' in exercise) {
			if (null === exercise.description || '' === exercise.description) {
				// OK
				exercise.description = null;
			} else if ('string' === typeof exercise.description) {
				// OK
				exercise.description = exercise.description.trim();
			} else {
				validation.add('Exercise description invalid', 'description');
			}
		} else {
			validation.add('Exercise description invalid', 'description');
		}
		if ('instructions' in exercise) {
			if (null === exercise.instructions || '' === exercise.instructions) {
				exercise.instructions = null;
			} else {
				if ('string' === typeof exercise.instructions) {
					// Parse and fall through
					exercise.instructions = exercise.instructions.trim().split('\n');
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
			if (null === exercise.alternatives || '' === exercise.alternatives) {
				// OK
				exercise.alternatives = null;
			} else {
				if (Array.isArray(exercise.alternatives)) {
					exercise.alternatives = validation.collect(exercise.alternatives, validate_exercise, [
						'alternatives'
					]);
				} else {
					validation.add('Alternatives can only be exercises.', 'alternatives');
				}
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

/**
 * Turns a string into a URL-ready slug
 *
 * @param {string} name
 * @returns {string}
 */
export function slug(name) {
	const maxLength = 80;
	let len = 0,
		index = 0,
		slug = '';
	// https://stackoverflow.com/a/66721429
	const tokens = name.split(/[^\p{L}\p{N}]+/gu);
	while (len < maxLength && index < tokens.length) {
		len += tokens[index].length;
		if (tokens[index].length > 0) {
			slug += (index > 0 ? '-' : '') + tokens[index++].toLowerCase();
		} else {
			index++;
		}
	}
	return slug;
}
