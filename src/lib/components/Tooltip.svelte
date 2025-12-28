<script lang="ts">
	import type { Country } from '$lib/appConfig/types';
	export let data: Country;
	export let xPosition: number;
	export let yPosition: number;
</script>

<div
	class="tooltip-open tooltip pointer-events-none absolute z-50 max-w-xs rounded-lg border border-gray-200 bg-base-100 p-3 text-gray-800 shadow-lg transition-all duration-200"
	style="top: {yPosition}px; left: {xPosition}px;"
>
	<h5 class="text-md mb-1 font-semibold text-blue-600">{data.country}</h5>
	<p class="mb-0.5 text-sm text-gray-500">
		Continent: {data.continent.charAt(0).toUpperCase() + data.continent.slice(1)}
	</p>
	{#if data.life_exp !== null}
		<p class="mb-0.5 text-sm text-gray-500">Life Expectancy: {data.life_exp} yrs</p>
	{/if}
	{#if data.income !== null}
		<p class="text-sm text-gray-500">GDP Per Capita: ${data.income}</p>
	{/if}
	{#if data.population !== null}
		<p class="text-sm text-gray-500">Population: ${data.population}</p>
	{/if}
</div>
