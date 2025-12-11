import 'vitest'; // Important: Import the module to be augmented
import type { MaybeInvalid } from './validation-types';

declare module 'vitest' {
	interface Assertion<T = any> {
		toBeValid(expected?: boolean): T;
	}
}
