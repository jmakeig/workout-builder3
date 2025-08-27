<script>
	/** @typedef {import('$lib/entities').Workout} Workout */
	/** @typedef {import('$lib/entities').Exercise} Exercise */
	/** @typedef {import('$lib/entities').Rest} Rest */

	/** @type {{ workout: Workout; }} */
	let { workout } = $props();

	/**
	 * Deep reactivity in the component. Changes won’t propogate to the parent.
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
			sets.splice(s, 0, []);
		};
	}

	/**
	 * Returns an event handler that closes over the `index`.
	 *
	 * @param {number} s
	 * @param {number} a
	 */
	function create_activity(s, a) {
		/**
		 *
		 * @param {MouseEvent} event
		 */
		return function create_activity_handler(event) {
			sets[s].splice(a, 0, { rest: { instructions: null }, duration: 60 });
		};
	}
</script>

<pre>{JSON.stringify(workout, null, 2)}</pre>

<div>
	<label for="name">Name</label>
	<input type="text" id="name" name="name" value={workout.name} />
</div>

<div>
	<label for="label">Label</label>
	<input type="text" id="label" name="label" value={workout.label} />
</div>

<div>
	<label for="description">Description</label>
	<textarea id="description" name="description">{workout.description}</textarea>
</div>

<div>
	{#each sets as set, s}
		<h2>Set {s + 1}</h2>
		<p>{set.reduce((total, current) => total + current.duration, 0)} seconds</p>
		{#each set as activity, a}
			<h3>Activity {a + 1}</h3>
			<button onclick={create_activity(s, a + 1)}>Add Activity</button>
		{:else}
			<button onclick={create_activity(s, -1)}>Create Activity</button>
		{/each}
		<button onclick={create_set(s + 1)}>Add Set</button>
	{:else}
		<button onclick={create_set(-1)}>Create Set</button>
	{/each}
</div>
