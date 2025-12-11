// @ts-nocheck
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

describe('Workout', () => {
	test('Workout valid', () => {
		expect('function' === typeof validate_pending_exercise).toBeValid(true);
	});
});
