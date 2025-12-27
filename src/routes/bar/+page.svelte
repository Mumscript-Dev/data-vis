<script lang="ts">
	import { year } from '../state.svelte';
	import type { Country, EntryData, NumericCountryKey } from '$lib/appConfig/types';
	import { hasNumericValue } from '$lib/helpers/typeGuard';
	import * as d3 from 'd3';

	const margin = {
		top: 0,
		bottom: 20,
		left: 20,
		right: 100
	};

	let width = $state(800);
	let height = $derived(100);
	$inspect(width, 'width in bar page');
	let innerHeight = $derived(height - margin.top - margin.bottom - 30);
	let innerWidth = $derived(width - margin.left - margin.right);

	const filterOptions = new Map<string, string>([
		['Population', 'population'],
		['Life expectancy', 'life_exp'],
		['Income', 'income']
	]);
	let filter = $state<NumericCountryKey>('population');

	const getFilteredData = (filter: NumericCountryKey, data: EntryData): Country[] => {
		return data.countries
			.filter((row): row is Country & Record<typeof filter, number> => hasNumericValue(row, filter))
			.sort((a, b) => b[filter] - a[filter])
			.slice(0, 20);
	};

	let filteredData = $derived.by(() => {
		if (!year.filteredData) return [];
		return getFilteredData(filter, year.filteredData);
	});
	$inspect(filteredData, 'filteredData in bar page');
	const continents = ['americas', 'europe', 'asia', 'africa'];
	let colors = $derived(d3.scaleOrdinal<string>().domain(continents).range(d3.schemeSet2));

	let yDomain = $derived(filteredData.map((row) => row.country));
	let yScale = $derived(
		d3.scaleBand().domain(yDomain).range([0, innerHeight]).paddingInner(0.1).paddingOuter(0.2)
	);

	const getXScale = (filter: string, innerWidth: number) => {
		if (filter === 'population')
			return d3.scaleLinear().domain([2000, 1_400_000_000]).range([0, innerWidth]);
		if (filter === 'life_exp') return d3.scaleLinear().domain([0, 90]).range([0, innerWidth]);
		return d3.scaleLog().base(10).domain([1400, 150000]).range([0, innerWidth]);
	};

	let xScale = $derived(getXScale(filter, innerWidth));
</script>

<header class="mt-2 flex shrink-0 flex-row gap-4 px-4">
	<h3 class=" w-1/1 text-base font-semibold text-primary sm:text-lg">
		Top 20 countries in {year.value}
	</h3>

	<div class="flex w-2/5 justify-end gap-2">
		<select id="metric-select" bind:value={filter} class="select-bordered select select-sm">
			{#each Array.from(filterOptions) as [label, key]}
				<option value={key}>{label}</option>
			{/each}
		</select>
	</div>
</header>
<div bind:clientWidth={width} bind:clientHeight={height} class="h-full w-full p-2">
	<svg {width} class="overflow-visible">
		<g transform={`translate(${margin.left}, ${margin.top})`}>
			{#each filteredData as row}
				<g>
					<rect
						x={0}
						y={yScale(row.country)}
						width={xScale(row[filter]!)}
						height={yScale.bandwidth()}
						fill={colors(row.continent)}
					/>
					<text
						x={xScale(row[filter]!) + 5}
						y={yScale(row.country)! + yScale.bandwidth() / 2}
						dominant-baseline="middle"
						font-size="12"
						fill={colors(row.continent)}
						stroke="hsl(var(--bc))"
						stroke-width="0.2"
					>
						{row.country}
					</text>
				</g>
			{/each}
		</g>
	</svg>
</div>
