<script>
	/**
	 * @template T
	 * @typedef {import('$lib/util').FormInput<T>} FormInput
	 */
	/** @typedef {import('$lib/entities').Exercise} Exercise */

	/** @type {FormInput<Exercise>} */

	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();

	console.log(form);
</script>

<h1>Create New Exercise</h1>

<form method="post" action="?/create">
	<div>
		<label for="name">Name</label>
		<input type="text" name="name" value={form?.exercise.name} required />
	</div>

	<div>
		<label for="label">Label</label>
		<input type="text" name="label" value={form?.exercise.label} required />
	</div>

	<div>
		<label for="description">Description</label>
		<textarea name="description">{form?.exercise.description}</textarea>
	</div>

	<div>
		<label for="instructions">Instructions:</label>
		<textarea name="instructions">{form?.exercise.instructions}</textarea>
	</div>

	<div class="buttons">
		<button type="submit">Save</button>
		<button>Cancel</button>
	</div>
</form>
