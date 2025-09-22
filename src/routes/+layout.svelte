<script>
	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();
</script>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li>
			<a href="/workouts">Workouts</a> <a href="/workouts/new">(new)</a>
		</li>
		<li><a href="/exercises">Exercises</a> (<a href="/exercises/new">new</a>)</li>
	</ul>
</nav>
<main>
	{@render children()}
</main>

<style>
	nav,
	main {
		max-width: 60rem;
		min-width: 20rem;
		margin: 1rem auto;
		border: solid 1px #ccc;
		padding: 1rem;
		border-radius: 0.5rem;
	}
	nav ul {
		margin: 0;
		padding: 0;
		display: flex;
		gap: 1rem;
		list-style: none;
	}
	nav ul li {
		margin: 0;
	}
</style>
