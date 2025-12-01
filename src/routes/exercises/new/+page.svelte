<script>
	import { enhance, applyAction } from '$app/forms';
	import { validate_exercise } from '$lib/entity-helpers';
	import { is_invalid } from '$lib/validation';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<h1>Create New Exercise</h1>

{#if form?.validation}
	<p>{form.validation.first()?.message}</p>
{:else if form}
	<p>Success!</p>
	<pre>{JSON.stringify(form.exercise, null, 2)}</pre>
{/if}

<form
	method="post"
	action="?/create"
	use:enhance={({ formData, cancel }) => {
		const pending_exercise = {
			...Object.fromEntries(formData),
			alternatives: console.warn('Exercise.alternatives is not implemented') ?? null
		};
		const exercise = validate_exercise(pending_exercise);
		if (is_invalid(exercise)) {
			applyAction({
				type: 'failure',
				status: 422,
				data: { validation: exercise.validation, exercise: pending_exercise }
			});
			cancel();
		}
		return; // Inherit default update behavior
	}}
>
	<div class="control">
		<label for="name">Name</label>
		<div class="contents">
			<input type="text" name="name" value={form?.exercise.name} placeholder={'\u200B'} />
			<p class="helper">The name of the exercise</p>
			{#if form?.validation?.has('name')}
				<p class="validation" id="name-error" aria-live="assertive">
					{form?.validation.first('name')?.message}
				</p>
			{/if}
		</div>
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

	<div class="control">
		<label for="alternatives">Alternatives:</label>
		<ul>
			<li><input type="checkbox" name="alternatives" value="push-up" /> Push-up</li>
		</ul>
	</div>

	<div class="control actions">
		<button type="submit" class="default">Save</button>
		<button>Cancel</button>
	</div>
</form>
