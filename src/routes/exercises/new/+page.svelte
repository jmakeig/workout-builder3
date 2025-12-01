<script>
	import { enhance, applyAction } from '$app/forms';
	import { validate_exercise } from '$lib/entity-helpers';
	import { is_invalid } from '$lib/validation';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	/** @type {import('svelte/action').Action<HTMLInputElement, import('$lib/validation').Validation<unknown> | undefined>} */
	function validate(input, validation) {
		const { name } = input;
		input.setCustomValidity(validation?.first(name)?.message ?? '');
		return {
			update(validation) {
				console.log(name, validation, validation?.first(name)?.message);
				input.setCustomValidity(validation?.first(name)?.message ?? '');
			},
			destroy() {
				input.setCustomValidity('');
			}
		};
	}
</script>

<h1>Create New Exercise</h1>

{#if form?.validation}
	<p class="validation">{form.validation.issues([])[0]?.message}</p>
{:else if form}
	<p>Success!</p>
	<pre>{JSON.stringify(form.exercise, null, 2)}</pre>
{/if}

{#snippet Control(
	/** @type {string} */
	name,
	/** @type {string | number | boolean | object & {toString: function}| null | undefined } */
	value,
	/** @type {string} */
	label = name,
	/** @type {import('$lib/validation').Validation<unknown> | undefined} */
	validation,
	/** @type {string | undefined} */
	help
)}
	<div class="control">
		<label for={name}>{label}</label>
		<div class="contents">
			<input
				type="text"
				{name}
				{value}
				placeholder={'\u200B'}
				use:validate={validation}
				aria-invalid={validation?.has('name')}
				aria-errormessage={validation?.has('name') ? `${name}-error` : undefined}
			/>
			{#if help}<p class="helper">{help}</p>{/if}
			{#if validation?.has(name)}
				<p class="validation" id={`${name}-error`} aria-live="assertive">
					{validation.first(name)?.message}
				</p>
			{/if}
		</div>
	</div>
{/snippet}

<form
	novalidate
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
	{@render Control(
		'name',
		form?.exercise.name,
		'Name',
		form?.validation,
		'The name of the exercise'
	)}
	{@render Control('label', form?.exercise.label, 'Label', form?.validation, 'The unique label')}
	<!--
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
    -->
	<div class="control">
		<label for="description">Description</label>
		<textarea name="description" placeholder={'\u200B'}>{form?.exercise.description}</textarea>
	</div>

	<div class="control">
		<label for="instructions">Instructions:</label>
		<textarea name="instructions" placeholder={'\u200B'}>{form?.exercise.instructions}</textarea>
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
