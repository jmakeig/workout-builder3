<script>
	import { first, has } from '$lib/validation';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<h1>Create New Workout</h1>

{#if form?.validations}
	<p>{first(form.validations)?.message}</p>
{:else if form}
	<p>Success!</p>
	<pre>{JSON.stringify(form.workout, null, 2)}</pre>
{/if}
<!--
{#snippet contro(name, label,value)}
	<div class="control">
		<label for="name">Name</label>
		<div class="contents">
			<input
				type="text"
				id={name}
				{name}
				{value}
				placeholder={'\u200B'}
				aria-invalid={has(form?.validations, 'name')}
				aria-errormessage={has(form?.validations, 'name') ? `name-error` : undefined}
			/>
			{#if has(form?.validations, 'name')}
				<p class="validation" id="name-error" aria-live="assertive">
					{first(form?.validations, 'name')?.message}
				</p>
			{/if}
		</div>
	</div>
{/snippet}
-->
<form method="post" action="?/create">
	<div class="control">
		<label for="name">Name</label>
		<div class="contents">
			<input
				type="text"
				id="name"
				name="name"
				value={form?.workout.name}
				placeholder={'\u200B'}
				aria-invalid={has(form?.validations, 'name')}
				aria-errormessage={has(form?.validations, 'name') ? `name-error` : undefined}
			/>
			{#if has(form?.validations, 'name')}
				<p class="validation" id="name-error" aria-live="assertive">
					{first(form?.validations, 'name')?.message}
				</p>
			{/if}
		</div>
	</div>

	<div class="control">
		<label for="label">Label</label>
		<input type="text" id="label" name="label" value={form?.workout.label} placeholder={'\u200B'} />
	</div>

	<div class="control">
		<label for="description">Description</label>
		<textarea
			id="description"
			name="description"
			placeholder={'\u200B'}
			value={form?.workout.description}
		></textarea>
	</div>

	<div class="control actions">
		<button type="submit" class="default">Save</button>
		<button>Cancel</button>
	</div>
</form>
