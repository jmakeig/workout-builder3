<script>
	import Workout from '$lib/components/Workout.svelte';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

{data.label}
<form>
	<Workout workout={data.workout} />
</form>

<style>
	form {
		max-width: 60rem;
		min-width: 20rem;
		margin: 0 auto;
	}
</style>
