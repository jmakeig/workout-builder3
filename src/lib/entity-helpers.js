/**
 * @template Input, Output
 * @typedef {import('@standard-schema/spec').StandardSchemaV1<Input, Output>} StandardSchemaV1
 */

import { setServers } from 'dns';

/**
 * @typedef {import('$lib/entities').ID} ID
 * @typedef {import('$lib/entities').Workout} Workout
 * @typedef {import('$lib/entities').PendingWorkout} PendingWorkout
 * @typedef {import('$lib/entities').Set} Set
 * @typedef {import('$lib/entities').Activity} Activity
 * @typedef {import('$lib/entities').Exercise} Exercise
 */

/**
 * @typedef {import('@standard-schema/spec').StandardSchemaV1.Issue} Issue
 * @typedef {import('@standard-schema/spec').StandardSchemaV1.PathSegment} PathSegment
 */

/**
 *
 * @param {unknown} value
 * @param {(issues: Issue[]) => void} [on_validate]
 * @param {(PropertyKey | PathSegment)[]} [base_path]
 * @returns {value is Workout}
 */
export function is_valid_workout(value, on_validate = (issues) => {}, base_path = []) {
	/** @type {Issue[]} */
	const issues = [];

	// Existence
	if ('object' === typeof value && null !== value) {
		// Property type
		if ('name' in value && 'string' === typeof value.name) {
			// Property constraints
			if (3 > value.name.length) {
				issues.push({
					message: 'Workout name must at least 3 letters.',
					path: [...base_path, 'name']
				});
			}
		} else {
			issues.push({ message: 'Workout name must be text', path: [...base_path, 'name'] });
		}
		// Property type
		if ('label' in value && 'string' === typeof value.label) {
			// Property constraints
			if (3 > value.label.length) {
				issues.push({
					message: 'Workout label must at least 3 letters.',
					path: [...base_path, 'label']
				});
			}
		} else {
			issues.push({ message: 'Workout label must be text', path: [...base_path, 'label'] });
		}
		// Property type
		if (
			'description' in value &&
			('string' === typeof value.description || null === value.description)
		) {
			// No constraints
		} else {
			issues.push({ message: 'Workout description invalid', path: [...base_path, 'description'] });
		}
		if ('sets' in value && Array.isArray(value.sets)) {
			value.sets.forEach((set, s) =>
				is_valid_set(set, (iss) => issues.push(...iss), [...base_path, 'sets', s])
			);
		} else {
			issues.push({ message: 'Workout sets must exist.', path: [...base_path, 'sets'] });
		}
	} else {
		issues.push({ message: 'Workout must exist.', path: [...base_path] });
	}

	if (on_validate) on_validate(issues);
	return 0 === issues.length;
}
/**
 * @param {unknown} value
 * @param {(issues: Issue[]) => void} [on_validate]
 * @param {(PropertyKey | PathSegment)[]} [base_path]
 * @returns {value is Set}
 */
export function is_valid_set(value, on_validate = (issues) => {}, base_path = []) {
	/** @type {Issue[]} */
	const issues = [];

	// Existence
	if ('object' === typeof value && null !== value && Array.isArray(value)) {
		value.forEach((activity, a) =>
			is_valid_activity(activity, (iss) => issues.push(...iss), [...base_path, a])
		);
	} else {
		issues.push({ message: 'Workout must exist.', path: [...base_path] });
	}

	if (on_validate) on_validate(issues);
	return 0 === issues.length;
}

/**
 * @param {unknown} value Probably a PendingActivity
 * @param {(issues: Issue[]) => void} [on_validate]
 * @param {(PropertyKey | PathSegment)[]} [base_path]
 * @returns {value is Activity}
 */
export function is_valid_activity(value, on_validate = (issues) => {}, base_path = []) {
	/** @type {Issue[]} */
	const issues = [];

	// Existence
	if ('object' === typeof value && null !== value) {
		if ('exercise' in value || 'rest' in value) {
			if ('exercise' in value) {
				is_valid_exercise(value.exercise, (iss) => issues.push(...iss), [...base_path, 'exercise']);
			}
			if ('rest' in value) {
				// No constraints
			}
			if (
				'duration' in value &&
				'number' === typeof value.duration &&
				!Number.isNaN(value.duration)
			) {
				if (0 >= value.duration) {
					issues.push({ message: '', path: [...base_path, 'duration'] });
				}
			} else {
				issues.push({
					message: 'Activity duration must be a number.',
					path: [...base_path, 'duration']
				});
			}
		} else {
			issues.push({ message: 'Activity must be exercise or rest.', path: [...base_path] });
		}
	} else {
		issues.push({ message: 'Activity must exist.', path: [...base_path] });
	}

	if (on_validate) on_validate(issues);
	return 0 === issues.length;
}

/**
 * @param {unknown} value
 * @param {(issues: Issue[]) => void} [on_validate]
 * @param {(PropertyKey | PathSegment)[]} [base_path]
 * @returns {value is Exercise}
 */
export function is_valid_exercise(value, on_validate = (issues) => {}, base_path = []) {
	/** @type {Issue[]} */
	const issues = [];

	// Existence
	if ('object' === typeof value && null !== value) {
		// Property type
		if ('name' in value && 'string' === typeof value.name) {
			// Property constraints
			if (3 > value.name.length) {
				issues.push({
					message: 'Exercise name must at least 3 letters.',
					path: [...base_path, 'name']
				});
			}
		} else {
			issues.push({ message: 'Exercise name must be text', path: [...base_path, 'name'] });
		}
		// Property type
		if ('label' in value && 'string' === typeof value.label) {
			// Property constraints
			if (3 > value.label.length) {
				issues.push({
					message: 'Exercise label must at least 3 letters.',
					path: [...base_path, 'label']
				});
			}
		} else {
			issues.push({ message: 'Exercise label must be text', path: [...base_path, 'label'] });
		}
		// Property type
		if (
			'description' in value &&
			('string' === typeof value.description || null === value.description)
		) {
			// No constraints
		} else {
			issues.push({ message: 'Exercise description invalid', path: [...base_path, 'description'] });
		}
		if ('instructions' in value) {
			if (null === value.instructions) {
				// OK
			} else if (Array.isArray(value.instructions)) {
				value.instructions.forEach((instruction, i) => {
					if ('string' !== typeof instruction) {
						issues.push({
							message: 'Exercise instruction must be text.',
							path: [...base_path, 'instructions', i]
						});
					}
				});
			} else {
				issues.push({
					message: 'Exercise instructions must exist.',
					path: [...base_path, 'instructions']
				});
			}
		} else {
			issues.push({
				message: 'Exercise instructions must exist.',
				path: [...base_path, 'instructions']
			});
		}
		if ('alternatives' in value) {
			if (null === value.alternatives) {
				// OK
			} else if (Array.isArray(value.alternatives)) {
				value.alternatives.forEach((alternative, a) =>
					is_valid_exercise(alternative, (iss) => issues.push(...iss), [
						...base_path,
						'alternatives',
						a
					])
				);
			} else {
				issues.push({
					message: 'Alternatives can only be exercises.',
					path: [...base_path, 'alternatives']
				});
			}
		} else {
			issues.push({
				message: 'Exercise alternatives must exist.',
				path: [...base_path, 'alternatives']
			});
		}
	} else {
		issues.push({ message: 'Workout must exist.', path: [...base_path] });
	}

	if (on_validate) on_validate(issues);
	return 0 === issues.length;
}

/**
 * @returns {StandardSchemaV1<PendingWorkout, Workout>}
 */
export function workout_schema() {
	return {
		'~standard': {
			version: 1,
			vendor: 'jmakeig',
			validate(value) {
				/** @type {Issue[]} */
				const issues = [];
				if (is_valid_workout(value, (i) => issues.push(...i))) return { value };
				return { issues };
			}
		}
	};
}
