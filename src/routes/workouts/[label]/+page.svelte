<script>
	import Workout from '$lib/components/Workout.svelte';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<form>
	<Workout workout={data.workout} exercises={data.exercises} />
</form>
