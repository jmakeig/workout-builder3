import type { Loosen } from './util';

declare const IDBrand: unique symbol;
/**
 * Need to remembrer to use a type assertion. 
 * This is not a normal string.
 * 
 * @example const id = @type {ID} ('string')
 */
type ID = string & { [IDBrand]: void };

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

export type Set = Array<
	(
		| {
				exercise: Exercise;
		  }
		| {
				rest: Rest;
		  }
	) & { duration: number }
>;

export type Exercise = {
	exercise: ID;
	name: string;
	label: string;
	description: string | null;
	instructions: Array<string> | null;
	alternatives: Array<Exercise> | null;
};

type Rest = {
	instructions: string | null;
};

export type PendingWorkout = Loosen<Workout>;
export type PendingExercise = Loosen<Exercise>;
