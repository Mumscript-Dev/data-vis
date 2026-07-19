<script lang="ts">
	import { year } from '../state.svelte';
	import * as d3 from 'd3';

	import type { Country } from '$lib/appConfig/types';
	import AxisX from '$lib/components/AxisX.svelte';
	import ScatterY from '$lib/components/ScatterY.svelte';
	import YearWatermark from '$lib/components/YearWatermark.svelte';
	import ChartTooltip from '$lib/components/ChartTooltip.svelte';
	import { createChartHover } from '$lib/store/chartHover';
	import { continentColor } from '$lib/helpers/continentColor';
	import {
		CONTINENTS,
		LABEL_COLOR,
		GDP_DOMAIN,
		GDP_TICKS,
		LIFE_EXP_DOMAIN,
		LIFE_EXP_TICKS,
		POPULATION_DOMAIN,
		responsiveChartMargin,
		xLabelOffset
	} from '$lib/appConfig/chartConfig';

	let width = $state(800);
	let height = $state(900);

	let margin = $derived(responsiveChartMargin(width));
	const labelColor = LABEL_COLOR;
	let continentFilter: string | null = $state(null);

	let innerHeight = $derived(height - margin.top - margin.bottom);
	let innerWidth = $derived(width - margin.left - margin.right);
	let xLableOffset = $derived(xLabelOffset(width));

	let data = $derived.by(() => {
		const countries = year.filteredData?.countries || [];
		if (!continentFilter) return countries;

		return countries.filter((country) => country.continent.toLowerCase() === continentFilter);
	});

	const continents = CONTINENTS;

	const yTicks = LIFE_EXP_TICKS;
	const xTicks = GDP_TICKS;

	let xScale = $derived(d3.scaleLog().base(10).domain(GDP_DOMAIN).range([0, innerWidth]));
	let yScale = $derived(d3.scaleLinear().domain(LIFE_EXP_DOMAIN).range([innerHeight, 0]));

	let area = $derived(d3.scaleSqrt().domain(POPULATION_DOMAIN).range([50, 2500]));

	const filterContinent = (continent: string) => {
		continentFilter = continent;
	};

	const resetContinentFilter = () => (continentFilter = null);

	const {
		hoveredData,
		mousePointWithMarginOffset,
		handleChartHover,
		handleLeaveChart,
		handleMouseCoord
	} = createChartHover<Country>();
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
	onmousemove={(e) => handleMouseCoord(e, margin)}
	class="flex h-full w-full p-2"
	role="region"
	aria-label="Scatterplot chart showing countries by
	life expectancy and GDP per capita"
>
	<svg {width} {height}>
		<g transform="translate({margin.left}, {margin.top})">
			<YearWatermark year={year.value} {innerWidth} {innerHeight} />
			{#if data}
				{#each data as row, index}
					{#if row['life_exp'] && row.income}
						<circle
							cy={yScale(row['life_exp'])}
							fill={continentColor(row.continent)}
							r={Math.sqrt(area(row.population) / Math.PI)}
							cx={xScale(row.income)}
							onmouseover={() => handleChartHover(row)}
							onfocus={() => handleChartHover(row)}
							onmouseleave={handleLeaveChart}
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

<ChartTooltip {hoveredData} {mousePointWithMarginOffset} />

<style>
	.yMeasure {
		font-size: 20px;
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}
</style>
