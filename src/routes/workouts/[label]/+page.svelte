<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

{data.label}

<pre>{JSON.stringify(data.workout, null, 2)}</pre>
