<script lang="ts">
	import type { Country } from '$lib/appConfig/types';
	export let country: Country;
	export let xPosition: number;
	export let yPosition: number;
</script>

<div
	class="tooltip-open tooltip pointer-events-none absolute z-50 max-w-xs rounded-lg border border-gray-200 bg-base-100 p-3 text-gray-800 shadow-lg transition-all duration-200"
	style="top: {yPosition}px; left: {xPosition}px;"
>
	<h5 class="text-md mb-1 font-semibold text-blue-600">{country.country}</h5>
	<p class="mb-0.5 text-sm text-gray-500">
		Continent: {country.continent.charAt(0).toUpperCase() + country.continent.slice(1)}
	</p>
	{#if country.life_exp !== null}
		<p class="mb-0.5 text-sm text-gray-500">Life Expectancy: {country.life_exp} yrs</p>
	{/if}
	{#if country.income !== null}
		<p class="text-sm text-gray-500">GDP Per Capita: ${country.income}</p>
	{/if}
</div>
