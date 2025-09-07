<script>
	/** @typedef {import('$lib/entities').Workout} Workout */
	/** @typedef {import('$lib/entities').PendingSet} PendingSet */
	/** @typedef {import('$lib/entities').PendingActivity} PendingActivity */
	/** @typedef {import('$lib/entities').PendingExercise} PendingExercise */
	/** @typedef {import('$lib/entities').PendingRest} PendingRest */

	/** @type {{ workout: Workout; }} */
	let { workout } = $props();

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
		return function create_activity_handler(event) {
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
		if ('number' === typeof value) return value;
		return fallback;
	}

	/** @type {PendingActivity} */
	const pending_rest = { rest: {}, duration: null, instructions: null };

	/**
	 *
	 * @param {PendingActivity} activity
	 * @returns {activity is PendingExercise}
	 */
	function is_exercise(activity) {
		return 'exercise' in activity;
	}
	/**
	 *
	 * @param {PendingActivity} activity
	 * @returns {activity is PendingRest}
	 */
	function is_rest(activity) {
		return 'rest' in activity;
	}
</script>

<div
	style="position: absolute; top: 0; right: 0; background: #efefef; padding: 1em; width: 20em; height: 20em; overflow: auto; border: solid 1px;"
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
							<select>
								<option value="sit-up">Sit-up</option>
								<option value="push-up">Push-up</option>
								<option value="plank">Plank</option>
								<option value="rest">Rest</option>
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
								class="default"
								onclick={create_activity(s, a + 1, pending_rest)}
								title="Add activity after…">+</button
							>
							<button class="default" onclick={remove_activity(s, a)} title="Remove activity"
								>-</button
							>
						</td>
					</tr>
				{:else}
					<tr>
						<td></td>
						<td></td>
						<td>
							<button
								class="default"
								onclick={create_activity(s, 0, pending_rest)}
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
