<script lang="ts">
	import { year } from './state.svelte';
	$inspect(year.filteredData);
</script>

<h1>SvelteKit Page for year {year.value}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
