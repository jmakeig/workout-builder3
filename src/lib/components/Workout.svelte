<script>
	/** @typedef {import('$lib/entities').Workout} Workout */
	/** @typedef {import('$lib/entities').Exercise} Exercise */
	/** @typedef {import('$lib/entities').PendingSet} PendingSet */
	/** @typedef {import('$lib/entities').PendingActivity} PendingActivity */
	/** @typedef {import('$lib/entities').PendingExercise} PendingExercise */
	/** @typedef {import('$lib/entities').PendingRest} PendingRest */

	/** @type {{ workout: Workout; exercises: Record<Exercise['label'], Exercise> }} */
	let { workout, exercises } = $props();

	/**
	 * Deep reactivity in the component. Changes won’t propogate to the parent.
	 * @type {Array<PendingSet>}
	 */
	let sets = $state(workout.sets);

	/**
	 * Returns an event handler that closes over the index, `s`.
	 * Creates a new set _after_ `s`.
	 *
	 * @param {number} s
	 */
	function create_set(s) {
		/**
		 *
		 * @param {MouseEvent} event
		 */
		return function create_set_handler(event) {
			console.log('create set', s, event);
			const new_activity = /** @type {PendingActivity} */ ({});
			sets.splice(s, 0, [new_activity]);
		};
	}

	/**
	 * Returns an event handler that closes over the `index`.
	 *
	 * @param {number} s
	 * @param {number} a
	 * @param {PendingActivity} activity
	 */
	function create_activity(s, a, activity) {
		/**
		 *
		 * @param {MouseEvent} event
		 * @returns {void}
		 */
		return function create_activity_handler(event) {
			sets[s].splice(a, 0, activity);
		};
	}

	/**
	 * Returns an event handler that closes over the `index`.
	 *
	 * @param {number} s
	 * @param {number} a
	 */
	function remove_activity(s, a) {
		/**
		 *
		 * @param {MouseEvent} event
		 * @returns {void}
		 */
		return function remove_activity_handler(event) {
			sets[s].splice(a, 1);
		};
	}
	/**
	 *
	 * @param {any} value
	 * @param {number} [fallback = 0]
	 * @returns {number}
	 */
	function n(value, fallback = 0) {
		if ('number' === typeof value && !Number.isNaN(value)) return value;
		if ('string' === typeof value) return parseInt(value, 10);
		return fallback;
	}

	const REST = '_rest';

	/**
	 * @param {PendingActivity} activity
	 * @returns {'exercise' | 'rest' | null }
	 * @throws {ReferenceError} If the activity is not recognized
	 */
	function activity_type(activity) {
		if (null === activity || undefined === activity) return null;
		if ('exercise' in activity) return 'exercise';
		if ('rest' in activity) return 'rest';
		return null;
	}

	/**
	 * @param {PendingActivity} activity
	 * @returns {activity is PendingActivity & { exercise: PendingExercise }}
	 */
	function is_exercise(activity) {
		return 'exercise' === activity_type(activity);
	}

	/**
	 * @param {PendingActivity} activity
	 * @returns {activity is PendingActivity & { rest: PendingRest }}
	 */
	function is_rest(activity) {
		return 'rest' === activity_type(activity);
	}

	/**
	 * @param {PendingActivity} activity
	 * @returns {() =>  Exercise['label'] | '_rest' | '' }
	 * @throws {ReferenceError} If the activity is not recognized
	 */
	function get_activity_value(activity) {
		console.log('Setting get_activity_value', activity);
		return function _get_activity_value() {
			if (is_exercise(activity)) {
				return activity.exercise.label ?? ''; // Bind getter needs to be string, not null
			} else if (is_rest(activity)) return REST;
			return '';
		};
	}

	/**
	 * @param {PendingActivity} activity
	 * @returns {(value: string) => void}
	 */
	function set_activity_value(activity) {
		return function _set_activity_value(label) {
			console.log('_set_activity_value', label, activity);
			if (exercises[label]) {
				//activity = { ...activity, rest: undefined, exercise: exercises[label] };
				//@ts-expect-error
				delete activity.rest;
				/** @type {PendingActivity & { exercise: PendingExercise }} */
				(activity).exercise = exercises[label];
			} else if (REST === label) {
				// activity = { ...activity, exercise: undefined, rest: {} };
				//@ts-expect-error
				delete activity.exercise;
				/** @type {PendingActivity & { rest: PendingRest }} */ (activity).rest = {};
			}
		};
	}
</script>

<div
	style="position: absolute; top: 0; right: 0; background: #efefef; padding: 1em; width: 20em; height: 20em; overflow: auto; border: solid 1px; font-size: 0.75em;"
>
	<pre>{JSON.stringify(sets, null, 2)}</pre>
</div>

<div class="control">
	<label for="name">Name</label>
	<input type="text" id="name" name="name" value={workout.name} />
</div>

<div class="control">
	<label for="label">Label</label>
	<input type="text" id="label" name="label" value={workout.label} />
</div>

<div class="control">
	<label for="description">Description</label>
	<textarea id="description" name="description">{workout.description || ' '}</textarea>
</div>

<!--
	* Add activity
		- Exercise?
			+ Pick from list
			+ Create new
				• Add to list
				• Select
		- Rest?
		- Duration
-->

<div>
	{#each sets as set, s}
		<h2>Set {s + 1}</h2>
		<p>{set.reduce((total, current) => total + n(current.duration), 0)} seconds</p>
		<table>
			<thead>
				<tr>
					<th>Activity</th>
					<th>Duration</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each set as activity, a}
					<tr>
						<td>
							<!-- https://svelte.dev/playground/9f6614468374436c84a5551ea29591f6?version=5.38.7 -->
							<select bind:value={get_activity_value(activity), set_activity_value(activity)}>
								<option></option>
								<optgroup label="Exercises">
									{#each Object.entries(exercises) as [k, v]}
										<option value={k}>{v.name}</option>
									{/each}
								</optgroup>
								<optgroup label="Other">
									<option value={REST}>Rest</option>
								</optgroup>
							</select>
						</td>
						<td
							><input
								id={`sets[${s}][${a}].duration`}
								name={`sets[${s}][${a}].duration`}
								class="numeric"
								style="width: 5em"
								bind:value={activity.duration}
							/> seconds</td
						>
						<td>
							<button
								class="thin default"
								onclick={create_activity(s, a + 1, {
									rest: {},
									duration: null,
									instructions: null
								})}
								title="Add activity after…"
								aria-label="Add activity after…"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="icon icon-tabler icons-tabler-filled icon-tabler-square-rounded-plus"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
										d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm0 6a1 1 0 0 0 -1 1v2h-2l-.117 .007a1 1 0 0 0 .117 1.993h2v2l.007 .117a1 1 0 0 0 1.993 -.117v-2h2l.117 -.007a1 1 0 0 0 -.117 -1.993h-2v-2l-.007 -.117a1 1 0 0 0 -.993 -.883z"
										fill="currentColor"
										stroke-width="0"
									/></svg
								>
							</button>
							<button
								class="thin"
								onclick={remove_activity(s, a)}
								title="Remove activity"
								aria-label="Remove activity"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="icon icon-tabler icons-tabler-outline icon-tabler-square-rounded-minus"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 12h6" /><path
										d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"
									/></svg
								>
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td></td>
						<td></td>
						<td>
							<button
								class="default"
								onclick={create_activity(s, 0, { rest: {}, duration: null, instructions: null })}
								title="Add activity after…">+</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="control actions">
			<button onclick={create_set(s + 1)}>Add Set</button>
		</div>
	{:else}
		<div class="control actions">
			<button class="default" onclick={create_set(-1)}>Create Set</button>
		</div>
	{/each}
</div>

<style>
	button.thin {
		border: none;
		background: none;
		padding: 0;
		cursor: pointer;
	}
	button.thin {
		color: var(--color-action-active); /* Doesn’t look very active */
	}
	button.thin.default {
		color: var(--color-action-default);
	}
</style>
