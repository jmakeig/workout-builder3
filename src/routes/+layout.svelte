<script>
	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();
</script>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/workouts">Workouts</a> (<a href="/workouts/new">new</a>)</li>
		<li><a href="/exercises">Exercises</a> (<a href="/exercises/new">new</a>)</li>
	</ul>
</nav>
{@render children()}
