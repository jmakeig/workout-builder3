<script>
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<h1>Create New Exercise</h1>

{#if form?.validations}
	<p>{form.validations[0].message}</p>
{:else if form}
	<p>Success!</p>
	<pre>{JSON.stringify(form.exercise, null, 2)}</pre>
{/if}

<form method="post" action="?/create">
	<div class="control">
		<label for="name">Name</label>
		<input type="text" name="name" value={form?.exercise.name} />
	</div>

	<div class="control">
		<label for="label">Label</label>
		<input type="text" name="label" value={form?.exercise.label} />
	</div>

	<div class="control">
		<label for="description">Description</label>
		<textarea name="description">{form?.exercise.description}</textarea>
	</div>

	<div class="control">
		<label for="instructions">Instructions:</label>
		<textarea name="instructions">{form?.exercise.instructions}</textarea>
	</div>

	<div class="control actions">
		<button type="submit" class="default">Save</button>
		<button>Cancel</button>
	</div>
</form>
