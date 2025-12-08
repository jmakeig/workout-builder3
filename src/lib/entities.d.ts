import type { Loosen } from './util';
import type { ID, Pending } from './entity-utils';

/**
 * Top-level entity. A workout is made of of ordered sets.
 */
export type Workout = {
	workout: ID;
	name: string;
	label: string;
	description: string | null;
	sets: Set[];
};

export type Set = Array<Activity>;

export type Activity = (
	| {
			exercise: Exercise;
	  }
	| {
			rest: Rest;
	  }
) & { duration: number; instructions: string | null };

export type Exercise = {
	exercise: ID;
	name: string;
	label: string;
	description: string | null;
	instructions: Array<string> | null;
	alternatives: Array<Exercise> | null;
};

type Rest = {};

export type PendingWorkout = Pending<Workout>;
export type PendingExercise = Pending<Exercise>;
export type PendingRest = Pending<Rest>;
export type PendingActivity = ({ exercise: PendingExercise } | { rest: PendingRest }) &
	Pending<{ duration: number; instructions: string }>;
export type PendingSet = Array<PendingActivity>;
