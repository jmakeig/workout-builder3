<script>
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<h1>Create New Workout</h1>

{#if form?.validations}
	<p>{form.validations[0].message}</p>
{:else if form}
	<p>Success!</p>
	<pre>{JSON.stringify(form.workout, null, 2)}</pre>
{/if}

<form method="post" action="?/create">
	<div>
		<label for="name">Name</label>
		<input type="text" id="name" name="name" value={form?.workout.name} />
	</div>

	<div>
		<label for="label">Label</label>
		<input type="text" id="label" name="label" value={form?.workout.label} />
	</div>

	<div>
		<label for="description">Description</label>
		<textarea id="description" name="description">{form?.workout.description}</textarea>
	</div>

	<div class="buttons">
		<button type="submit">Save</button>
		<button>Cancel</button>
	</div>
</form>
