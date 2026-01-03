<script>
	import Control from '$lib/components/Control.svelte';
	import { enhance, applyAction } from '$app/forms';
	import { validate_pending_exercise } from '$lib/entity-helpers';
	import { is_invalid } from '$lib/validation';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	/** @type {import('svelte/action').Action<HTMLInputElement | HTMLTextAreaElement, import('$lib/validation').Validation<unknown> | undefined>} */
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

	/**
	 * @template Entity
	 * @typedef {import('$lib/entity-utils').Pending<Entity>} Pending
	 */
	/**
	 * @typedef {import('$lib/entities').Exercise} Exercise
	 */
</script>

<h1>Create New Exercise</h1>

{#if form?.validation}
	{#if form.validation.first([])}
		<p class="validation">{form.validation.first([])?.message}</p>
	{:else}
		<p class="validation">Oops!</p>
	{/if}
{:else if form}
	<p>Success!</p>
	<pre>{JSON.stringify(form.exercise, null, 2)}</pre>
{/if}

<form
	novalidate
	method="post"
	action="?/create"
	class:invalid={form?.validation?.has()}
	use:enhance={({ formData, cancel }) => {
		const pending_exercise = /** @type {Pending<Exercise>} */ ({
			...Object.fromEntries(formData),
			exercise: null, // Indicates that it’s new
			alternatives: console.warn('Exercise.alternatives is not implemented') ?? null
		});
		const exercise = validate_pending_exercise(pending_exercise);
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
	<Control
		name="name"
		value={form?.exercise.name}
		label="Name"
		validation={form?.validation}
		help="The name of the exercise"
	/>
	<Control
		name="label"
		value={form?.exercise.label}
		label="Label"
		validation={form?.validation}
		help="The unique label"
	/>
	<Control
		name="description"
		value={form?.exercise.description}
		label="Description"
		validation={form?.validation}
		help="A short summary"
	>
		{#snippet input(provided)}
			<textarea {...provided}></textarea>
		{/snippet}
	</Control>
	<Control
		name="instructions"
		value={Array.isArray(form?.exercise.instructions)
			? form?.exercise.instructions.join('\n')
			: form?.exercise.instructions}
		validation={form?.validation}
		help="How to do the exercise"
	>
		{#snippet input(provided)}
			<textarea {...provided}></textarea>
		{/snippet}
	</Control>
	<div class="control">
		<label for="alternatives">Alternatives:</label>
		<div class="contents">
			<ul>
				{#each Object.entries(data.exercises) as [label, exercise]}
					<li>
						<input type="checkbox" name="alternatives" value={exercise.exercise} />
						<a href={`/exercises/${label}`}>{exercise.name}</a>
					</li>
				{/each}
			</ul>
			{#if form?.validation?.has('alternatives')}
				<p class="validation" id={`${'alternatives'}-error`} aria-live="assertive">
					{form.validation.first('alternatives')?.message}
				</p>
			{/if}
		</div>
	</div>

	<div class="control actions">
		<button type="submit" class="default">Save</button>
		<button>Cancel</button>
	</div>
</form>
