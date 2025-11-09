<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>Workouts</h1>

<ul>
	{#each data.workouts as workout}
		<li><a href={`/workouts/${workout.label}`}>{workout.name}</a></li>
	{:else}
		<li>No workouts found.</li>
	{/each}
</ul>
