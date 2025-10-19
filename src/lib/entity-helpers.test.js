import { expect, test } from 'vitest';
import { is_valid_activity, is_valid_exercise, is_valid_set } from './entity-helpers';

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

test('Activity', () => {
	expect(
		is_valid_activity({
			exercise: {
				exercise: '1',
				name: 'Push Up',
				label: 'push-up',
				description: null,
				instructions: null,
				alternatives: null
			},
			duration: 30
		})
	).toBe(true);
	expect(
		is_valid_activity({
			rest: {},
			duration: 30
		})
	).toBe(true);
	expect(
		is_valid_activity({
			exercise: '2',
			duration: 0
		})
	).toBe(false);
	expect(is_valid_activity(null)).toBe(false);
});

test('Set', () => {
	expect(is_valid_set(null)).toBe(false);
	expect(is_valid_set([])).toBe(true);
	expect(
		is_valid_set([
			{
				rest: {},
				duration: 20
			}
		])
	).toBe(true);
	expect(
		is_valid_set([
			{
				rest: {},
				duration: -20
			}
		]),
		'Nested Activity'
	).toBe(false);
});

test('Exercise', () => {
	expect(
		is_valid_exercise({
			exercise: '1',
			name: 'Push Up',
			label: 'push-up',
			description: null,
			instructions: null,
			alternatives: null
		})
	).toBe(true);
	expect(is_valid_exercise(null)).toBe(false);
	expect(
		is_valid_exercise({
			exercise: '1',
			name: 'P',
			label: 'push-up',
			description: null,
			instructions: null,
			alternatives: null
		}),
		'.name too short'
	).toBe(false);

	/** @type {Issue[]} */
	const issues = [];
	const is_valid = is_valid_exercise(
		{
			exercise: '1',
			name: 'P',
			label: 'push-up',
			description: null,
			instructions: null,
			alternatives: null
		},
		(iss) => issues.push(...iss)
	);
	expect(is_valid).toBe(false);
	expect(issues).toHaveLength(1);
	expect(issues[0].path).toEqual(['name']);
});
