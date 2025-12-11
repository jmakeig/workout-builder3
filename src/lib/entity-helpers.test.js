// @xxts-nocheck
import './vitest.d.ts';
import { describe, expect, test } from 'vitest';
import { is_invalid } from '$lib/validation';
import { validate_pending_exercise } from './entity-helpers';

expect.extend({
	toBeValid(received, expected) {
		return {
			// do not alter your "pass" based on isNot. Vitest does it for you
			pass: !is_invalid(received) === expected,
			message: () => `${JSON.stringify(received)} from toBeValid() expectation`
		};
	}
});

/**
 * @typedef {import('$lib/entity-utils').ID} ID
 * @typedef {import('$lib/entities').Exercise} Exercise
 */

describe('Pending Exercise', () => {
	test('Empty', () => {
		const exercise = {};
		// @ts-expect-error
		const result = validate_pending_exercise(exercise);
		expect(result).toBeValid(false);
		if (is_invalid(result)) {
			expect(result.validation.length).toBeGreaterThan(0);
			expect(result.validation.has('exercise')).toBe(true);
			expect(result.validation.has('name')).toBe(true);
			expect(result.validation.has('label')).toBe(true);
			expect(result.validation.has('instructions')).toBe(true);
			expect(result.validation.has('alternatives')).toBe(true);
		} else {
			expect.unreachable('Should be invalid');
		}
	});
	test('Invalid', () => {
		const exercise = {
			exercise: null,
			name: 'P           ',
			label: null,
			description: null,
			instructions: null,
			alternatives: null
		};
		const result = validate_pending_exercise(exercise);
		expect(result).toBeValid(false);
		if (is_invalid(result)) {
			expect(result.validation.length).toBeGreaterThan(0);
			console.log(result.validation.toString());
			expect(result.validation.issues('name')).toHaveLength(1);
			expect(result.validation.issues('label')).toHaveLength(1);
		} else {
			expect.unreachable('Should be invalid');
		}
	});
	test('Valid', () => {
		const exercise = {
			exercise: null,
			name: 'Push Up',
			label: null,
			description: 'A basic push up exercise.             ',
			instructions: 'Get down on the floor.\nPush yourself up.\nRepeat.',
			alternatives: [{ exercise: /** @type {ID} */ ('2') }, { exercise: /** @type {ID} */ ('3') }]
		};
		const result = validate_pending_exercise(exercise);
		// console.log(result.validation.toString());
		expect(result).toBeValid(true);
		if (is_invalid(result)) {
			expect.unreachable('Should be valid');
		} else {
			expect(result.name).toBe('Push Up');
			expect(result.label, 'Generates slug').toBe('push-up');
			expect(result.description, 'Trims string').toBe('A basic push up exercise.');
			expect(result.instructions, 'Parses string into Array').toEqual([
				'Get down on the floor.',
				'Push yourself up.',
				'Repeat.'
			]);
			expect(result.alternatives).toEqual([{ exercise: '2' }, { exercise: '3' }]);
		}
	});
});
