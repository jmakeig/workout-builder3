<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>Exercises</h1>
<ul>
	{#each Object.entries(data.exercises) as [id, exercise]}
		<li><a href="/exercises/{exercise.label}">{exercise.name}</a></li>
	{:else}
		<li class="nope">Nope!</li>
	{/each}
</ul>
