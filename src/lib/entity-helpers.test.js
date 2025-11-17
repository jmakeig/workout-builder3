// @ts-nocheck
import { describe, expect, test } from 'vitest';
import { is_invalid } from '$lib/validation';
import {
	validate_activity,
	validate_exercise,
	validate_set,
	validate_workout
} from './entity-helpers';

expect.extend({
	isValid(received, expected) {
		return {
			// do not alter your "pass" based on isNot. Vitest does it for you
			pass: !is_invalid(received) === expected,
			message: () => `${JSON.stringify(received)} from isValid() expectation`
		};
	}
});

/**
 * @typedef {import('$lib/entities').ID} ID
 * @typedef {import('$lib/entities').Workout} Workout
 * @typedef {import('$lib/entities').PendingWorkout} PendingWorkout
 * @typedef {import('$lib/entities').Set} Set
 * @typedef {import('$lib/entities').Activity} Activity
 * @typedef {import('$lib/entities').Exercise} Exercise
 */

describe.skip('Workout', () => {
	test('Workout valid', () => {
		expect(
			validate_workout({
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
		// expect(
		// 	!is_invalid(
		// 		validate_activity({
		// 			exercise: {
		// 				exercise: '1',
		// 				name: 'Push Up',
		// 				label: 'push-up',
		// 				description: null,
		// 				instructions: null,
		// 				alternatives: null
		// 			},
		// 			duration: 30
		// 		})
		// 	)
		// ).toBe(true);
		expect(
			validate_activity({
				rest: {},
				duration: 30
			})
		).isValid(true);
	});
	test('Activity invalid', () => {
		expect(
			validate_activity({
				exercise: '2',
				duration: 0
			})
		).isValid(false);
		expect(validate_activity(null)).isValid(false);
	});
});

describe.skip('Set', () => {
	test('Set invalid', () => {
		expect(validate_set(null)).toBe(false);
		expect(
			validate_set({
				rest: {},
				duration: 20
			})
		).toBe(false);
		expect(
			validate_set([
				{
					rest: {},
					duration: -20
				}
			]),
			'Nested Activity'
		).toBe(false);
	});
	test('Set valid', () => {
		expect(validate_set([])).toBe(true);
		expect(
			validate_set([
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
		const is_valid = validate_set(
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
		const is_valid = validate_set(
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
			validate_exercise({
				exercise: '1',
				name: 'Push Up',
				label: 'push-up',
				description: null,
				instructions: null,
				alternatives: null
			})
		).isValid(true);
		expect(
			validate_exercise({
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
		).isValid(true);
	});
	test('Exercise invalid', () => {
		expect(validate_exercise(null)).isValid(false);
		expect(
			validate_exercise({
				exercise: '1',
				name: 'P',
				label: 'push-up',
				description: null,
				instructions: null,
				alternatives: null
			}),
			'.name too short'
		).isValid(false);
	});
	test.skip('Nested paths', () => {
		/** @type {Validation<Exercise>[]} */
		const issues = [];
		const is_valid = validate_exercise({
			exercise: '1',
			name: 'P',
			label: 'push-up',
			description: null,
			instructions: null,
			alternatives: null
		});
		expect(is_valid).toBe(false);
		expect(issues).toHaveLength(1);
		expect(issues[0].path).toEqual(['name']);
	});
	test.skip('Multiple nested paths', () => {
		const is_valid = validate_exercise({
			exercise: '1',
			name: 'P',
			label: 'push-up',
			description: null,
			instructions: null,
			alternatives: [3]
		});
		expect(is_valid).toBe(false);
		// expect(issues).toHaveLength(2);
		// expect(issues[0].path).toEqual(['name']);
		// expect(issues[1].path).toEqual(['alternatives', 0]);
	});
	test('Recursive exercises', () => {
		const is_valid = validate_exercise({
			exercise: '1',
			name: 'X',
			label: 'push-up',
			description: null,
			instructions: null,
			alternatives: [
				{
					exercise: '1',
					name: 'X',
					label: 'push-up',
					description: null,
					instructions: null,
					alternatives: [
						{
							exercise: '1',
							name: 'X',
							label: 'push-up',
							description: null,
							instructions: null,
							alternatives: null
						}
					]
				}
			]
		});
		expect(is_valid).isValid(false);
		expect(is_valid.validation).toHaveLength(3);
		expect(is_valid.validation.get(0).path).toEqual(['name']);
		expect(is_valid.validation.get(1).path).toEqual(['alternatives', 0, 'name']);
		expect(is_valid.validation.get(2).path).toEqual(['alternatives', 0, 'alternatives', 0, 'name']);
	});
});
