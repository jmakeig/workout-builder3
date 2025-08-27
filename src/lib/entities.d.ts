import type { OmitMatch, Loosen } from './util';

type ID = string & { readonly __brand: 'Identifier' };

/**
 * Top-level entity. A workout is made of of ordered sets.
 */
export type Workout = {
	workout: ID;
	name: string;
	label: string;
	description: string;
	sets: Set[];
};

export type Set = Array<{
	activity: (Activity & Exercise & { readonly type: 'exercise' }) | Rest;
	duration: number; // in seconds
}>;

type Activity = {
	readonly activity: string;
};

export type Exercise = {
	exercise: ID;
	name: string;
	label: string;
	description: string | null;
	instructions: Array<string> | null;
	alternatives: Array<Exercise> | null;
};

export type Rest = Activity & {
	readonly activity: 'rest';
};

export type PendingWorkout = Loosen<Workout>;
export type PendingExercise = Loosen<Exercise>;
