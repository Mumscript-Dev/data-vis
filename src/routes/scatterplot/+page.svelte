<script lang="ts">
	import { year } from '../state.svelte';
	import * as d3 from 'd3';

	import type { Country } from '$lib/appConfig/types';
	import AxisX from '$lib/components/AxisX.svelte';
	import ScatterY from '$lib/components/ScatterY.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let width = $state(800);
	let height = $state(900);

	let margin = $derived({
		top: 20,
		bottom: 120,
		left: width < 640 ? 20 : 80,
		right: width < 640 ? 20 : 80
	});
	const labelColor = '#55bcd9';
	let continentFilter: string | null = $state(null);

	let innerHeight = $derived(height - margin.top - margin.bottom);
	let innerWidth = $derived(width - margin.left - margin.right);
	let xLableOffset = $derived(width < 640 ? 10 : 40);

	let data = $derived.by(() => {
		const countries = year.filteredData?.countries || [];
		if (!continentFilter) return countries;

		return countries.filter((country) => country.continent.toLowerCase() === continentFilter);
	});

	const continents = ['americas', 'europe', 'asia', 'africa'];

	const yTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
	const xTicks = [140, 400, 4000, 40000, 170000];
	const populationDomain = [2000, 1400000000];

	let xScale = $derived(d3.scaleLog().base(10).domain([140, 170000]).range([0, innerWidth]));
	let yScale = $derived(d3.scaleLinear().domain([0, 90]).range([innerHeight, 0]));

	let colors = $derived(d3.scaleOrdinal<string>().domain(continents).range(d3.schemeSet2));

	let area = $derived(d3.scaleSqrt().domain(populationDomain).range([50, 2500]));

	const filterContinent = (continent: string) => {
		continentFilter = continent;
	};

	const resetContinentFilter = () => (continentFilter = null);
	let hoveredData: Country | null = $state(null);
	const handleChartHover = (data: Country) => {
		hoveredData = data;
	};

	const handleLeaveChart = () => {
		hoveredData = null;
	};

	let mousePointWithMarginOffset = { x: 0, y: 0 };
	const handleMouseCoord = (event: any) => {
		mousePointWithMarginOffset.x = event.pageX - margin.left - margin.right;
		mousePointWithMarginOffset.y = event.pageY - margin.top - margin.bottom;
	};
</script>

<div class="mt-4 flex flex-wrap justify-center gap-2">
	{#each continents as continent}
		<button
			class="btn btn-sm"
			class:btn-primary={continentFilter === continent}
			onclick={() => filterContinent(continent)}
		>
			{continent.charAt(0).toUpperCase() + continent.slice(1)}
		</button>
	{/each}

	<button class="btn btn-outline btn-sm" onclick={resetContinentFilter}> Reset </button>
</div>
<div
	bind:clientWidth={width}
	bind:clientHeight={height}
	onmousemove={handleMouseCoord}
	class="flex h-full w-full p-2"
	role="region"
	aria-label="Scatterplot chart showing countries by life expectancy and GDP per capita"
>
	<svg {width} {height}>
		<g transform="translate({margin.left}, {margin.top})">
			<text
				x={innerWidth / 2}
				y={(innerHeight * 2) / 3}
				text-anchor="middle"
				class="opacity-50"
				stroke="lightgray"
				style="font-size: {innerWidth / 3}; fill: lightgray">{year.value}</text
			>
			{#if data}
				{#each data as row, index}
					{#if row['life_exp'] && row.income}
						<circle
							cy={yScale(row['life_exp'])}
							fill={colors(row.continent)}
							r={Math.sqrt(area(row.population) / Math.PI)}
							cx={xScale(row.income)}
							onmouseover={() => handleChartHover(row)}
							onfocus={() => handleChartHover(row)}
							onmouseleave={() => handleLeaveChart()}
							tabIndex="0"
							role="graphics-symbol"
						/>
					{/if}
				{/each}
			{/if}
			<AxisX {xScale} {innerWidth} {innerHeight} {xTicks} {labelColor} />
			<ScatterY {yScale} {innerHeight} {yTicks} {labelColor} {width} />
		</g>
		<text
			class="yMeasure text-primary"
			x={xLableOffset}
			y={innerHeight / 2 + margin.top}
			text-anchor="middle"
			fill={labelColor}>Life Expectatancy (Years)</text
		>
		<text
			class="xMeasure"
			y={innerHeight + margin.top + 50}
			x={innerWidth / 2 + margin.left}
			text-anchor="middle"
			fill={labelColor}>GDP Per Capita ($)</text
		>
	</svg>
</div>

{#if hoveredData}
	<Tooltip
		data={hoveredData}
		xPosition={mousePointWithMarginOffset.x}
		yPosition={mousePointWithMarginOffset.y}
	/>
{/if}

<style>
	.yMeasure {
		font-size: 20px;
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}
</style>
