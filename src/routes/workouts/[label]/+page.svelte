<script>
	import Workout from '$lib/components/Workout.svelte';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();
	
</script>

{data.label}

<Workout workout={data.workout} />


