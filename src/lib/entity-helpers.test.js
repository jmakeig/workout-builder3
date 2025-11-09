import { describe, expect, test } from 'vitest';
import {
	is_valid_activity,
	is_valid_exercise,
	is_valid_set,
	is_valid_workout
} from './entity-helpers';

/**
 * @typedef {import('$lib/entities').ID} ID
 * @typedef {import('$lib/entities').Workout} Workout
 * @typedef {import('$lib/entities').PendingWorkout} PendingWorkout
 * @typedef {import('$lib/entities').Set} Set
 * @typedef {import('$lib/entities').Activity} Activity
 * @typedef {import('$lib/entities').Exercise} Exercise
 */

/**
 * @template Entity
 * @typedef {import('$lib/util').Validation<Entity>} Validation
 */

describe('Workout', () => {
	test('Workout valid', () => {
		expect(
			is_valid_workout({
				name: 'Morning Routine',
				label: 'morning-routine',
				description: 'A quick morning workout to start the day',
				sets: [] // TODO: Should this be null?
			})
		).toBe(true);
	});
});

describe('Activity', () => {
	test('Activity valid', () => {
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
	});
	test('Activity invalid', () => {
		expect(
			is_valid_activity({
				exercise: '2',
				duration: 0
			})
		).toBe(false);
		expect(is_valid_activity(null)).toBe(false);
	});
});

describe('Set', () => {
	test('Set invalid', () => {
		expect(is_valid_set(null)).toBe(false);
		expect(
			is_valid_set({
				rest: {},
				duration: 20
			})
		).toBe(false);
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
	test('Set valid', () => {
		expect(is_valid_set([])).toBe(true);
		expect(
			is_valid_set([
				{
					rest: {},
					duration: 20
				}
			])
		).toBe(true);
	});
	test('Set path', () => {
		/** @type {Validation<Set>[]} */
		const issues = [];
		const is_valid = is_valid_set(
			[
				{
					rest: {},
					duration: -20
				}
			],
			(iss) => issues.push(...iss)
		);
		expect(is_valid).toBe(false);
		expect(issues).toHaveLength(1);
		expect(issues[0].path).toEqual([0, 'duration']);
	});
	test('Set path', () => {
		/** @type {Validation<Set>[]} */
		const issues = [];
		const is_valid = is_valid_set(
			[
				{
					exercise: {
						name: '-', // Too short
						label: 'push-up',
						description: null,
						instructions: null,
						alternatives: null
					},
					duration: -20
				}
			],
			(iss) => issues.push(...iss)
		);
		expect(is_valid).toBe(false);
		expect(issues.length > 1).toBe(true);
		// TODO: The order here feels very brittle
		expect(issues[0].path).toEqual([0, 'exercise', 'name']);
		expect(issues[1].path).toEqual([0, 'duration']);
	});
});

describe('Exercise', () => {
	test('Exercise valid', () => {
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
		expect(
			is_valid_exercise({
				exercise: '1',
				name: 'Push Up',
				label: 'push-up',
				description: null,
				instructions: null,
				alternatives: [
					{
						exercise: '1.1',
						name: 'Nested',
						label: 'nested',
						description: 'Nested exercise should be validated as an exercise',
						instructions: null,
						alternatives: null
					},
					{
						exercise: '1.2',
						name: 'Nested',
						label: 'nested',
						description: 'Nested exercise should be validated as an exercise',
						instructions: null,
						alternatives: null
					}
				]
			})
		).toBe(true);
	});
	test('Exercise invalid', () => {
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
	});
	test('Nested paths', () => {
		/** @type {Validation<Exercise>[]} */
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
	test('Multiple nested paths', () => {
		/** @type {Validation<Exercise>[]} */
		const issues = [];
		const is_valid = is_valid_exercise(
			{
				exercise: '1',
				name: 'P',
				label: 'push-up',
				description: null,
				instructions: null,
				alternatives: [3]
			},
			(iss) => issues.push(...iss)
		);
		expect(is_valid).toBe(false);
		expect(issues).toHaveLength(2);
		expect(issues[0].path).toEqual(['name']);
		expect(issues[1].path).toEqual(['alternatives', 0]);
	});
	test('Recursive exercises', () => {
		/** @type {Validation<Exercise>[]} */
		const issues = [];
		const is_valid = is_valid_exercise(
			{
				exercise: '1',
				name: 'P',
				label: 'push-up',
				description: null,
				instructions: null,
				alternatives: [
					{
						exercise: '1',
						name: 'P',
						label: 'push-up',
						description: null,
						instructions: null,
						alternatives: [
							{
								exercise: '1',
								name: 'Push-Up',
								label: 'push-up',
								description: null,
								instructions: null,
								alternatives: null
							}
						]
					}
				]
			},
			(iss) => issues.push(...iss)
		);
		expect(is_valid).toBe(false);
		expect(issues).toHaveLength(2);
		expect(issues[0].path).toEqual(['name']);
		expect(issues[1].path).toEqual(['alternatives', 0, 'name']);
	});
});
