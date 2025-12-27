<script lang="ts">
	import type { Country } from '$lib/appConfig/types';
	export let data: Country;
	export let xPosition: number;
	export let yPosition: number;
</script>

<div class="tooltip" style="position: absolute; top: {yPosition}px; left: {xPosition}px;">
	<h5 class="text-md mb-1 font-semibold text-blue-600">{data.country}</h5>
	<p class="mb-0.5 text-sm text-gray-500">Continent: {data.continent}</p>
	{#if data.population !== null}
		<p class="mb-0.5 text-sm text-gray-500">Population: {data.population}</p>
	{/if}
	{#if data.life_exp !== null}
		<p class="mb-0.5 text-sm text-gray-500">Life Expectancy: {data.life_exp} yrs</p>
	{/if}
	{#if data.income !== null}
		<p class="text-sm text-gray-500">GDP Per Capita: ${data.income}</p>
	{/if}
</div>

<style>
	h5 {
		margin: 0;
		margin-left: 0.3rem;
		margin-right: 0.3rem;
	}
	p {
		font-size: small;
		margin: 0;
		margin-left: 0.3rem;
		margin-right: 0.3rem;
	}
	.tooltip {
		padding: 0.2rem;
		border: solid 1px black;
		background: white;
		pointer-events: none;
		border-radius: 1rem;
		opacity: 0;
		animation: fadeIn 300ms ease-in forwards;
		color: #00bcd4;
	}
	@keyframes fadeIn {
		100% {
			opacity: 1;
		}
	}
</style>
