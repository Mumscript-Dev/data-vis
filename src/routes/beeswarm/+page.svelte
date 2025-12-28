<script lang="ts">
	import { year } from '../state.svelte';
	import * as d3 from 'd3';
	import type { SimulationNodeDatum } from 'd3-force';
	import type { Country } from '$lib/appConfig/types';
	import ScatterTooltip from '$lib/components/ScatterTooltip.svelte';
	import AxisX from '$lib/components/AxisX.svelte';
	import BeeSwarmY from '$lib/components/BeeSwarmY.svelte';

	type CountryNode = Country & SimulationNodeDatum;

	let width = $state(800);
	let height = $state(900);
	let margin = $derived({
		top: 20,
		bottom: 120,
		left: width < 640 ? 20 : 80,
		right: width < 640 ? 20 : 80
	});

	const labelColor = '#55bcd9';
	let innerHeight = $derived(height - margin.top - margin.bottom);
	let innerWidth = $derived(width - margin.left - margin.right);
	let xLableOffset = $derived(width < 640 ? 10 : 40);

	let metric = $state<'GDP Per Capita ($)' | 'Life Expectancy (Years)'>('GDP Per Capita ($)');
	let data = $derived<CountryNode[]>(year.filteredData?.countries ?? []);

	const continents = ['americas', 'europe', 'asia', 'africa'];

	let color = $derived(d3.scaleOrdinal<string>().domain(continents).range(d3.schemeSet2));

	let xScale = $derived(
		metric === 'GDP Per Capita ($)'
			? d3.scaleLog().base(10).domain([140, 170000]).range([0, innerWidth])
			: d3.scaleLinear().domain([0, 90]).range([0, innerWidth])
	);

	let yScale = $derived(
		d3.scaleBand().domain(continents).range([innerHeight, 50]).paddingOuter(0.1)
	);

	const setMetric = (newMetric: 'GDP Per Capita ($)' | 'Life Expectancy (Years)') => {
		metric = newMetric;
	};

	const xTicks = $derived(
		metric === 'GDP Per Capita ($)'
			? [140, 400, 4000, 40000, 170000]
			: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
	);

	const RADIUS = 10;

	const positionCache = new Map<string, { x: number; y: number }>();

	$effect(() => {
		for (const d of data) {
			const key = d.country; // assumes country name is stable

			const cached = positionCache.get(key);
			if (cached) {
				d.x = cached.x;
				d.y = cached.y;
			} else {
				d.x ??= innerWidth / 2;
				d.y ??= innerHeight / 2;
			}
		}
	});

	let simulation = $derived(d3.forceSimulation<CountryNode>(data));
	let nodes = $state<CountryNode[]>([]);

	$effect(() => {
		simulation.on('tick', () => {
			nodes = simulation.nodes();

			for (const n of nodes) {
				if (n.x != null && n.y != null) {
					positionCache.set(n.country, { x: n.x, y: n.y });
				}
			}
		});
	});

	$effect(() => {
		simulation
			.force(
				'x',
				d3
					.forceX<CountryNode>()
					.x((d) => {
						if (metric === 'GDP Per Capita ($)' && d.income != null) {
							return xScale(d.income);
						}
						if (metric === 'Life Expectancy (Years)' && d.life_exp != null) {
							return xScale(d.life_exp);
						}
						return innerWidth / 2;
					})
					.strength(0.8)
			)
			.force(
				'y',
				d3
					.forceY<CountryNode>()
					.y((d) => yScale(d.continent) ?? innerHeight / 2)
					.strength(0.2)
			)
			.force('collide', d3.forceCollide().radius(RADIUS))
			.alpha(1)
			.alphaDecay(0.08)
			.restart();
	});

	let hoveredData: Country | null = $state(null);
	const handleChartHover = (data: Country) => {
		hoveredData = data;
	};
	const handleLeaveChart = () => {
		hoveredData = null;
	};

	let mousePointWithMarginOffset = { x: 0, y: 0 };
	const handleMouseCoord = (event: MouseEvent) => {
		mousePointWithMarginOffset.x = event.pageX - margin.left - margin.right;
		mousePointWithMarginOffset.y = event.pageY - margin.top - margin.bottom;
	};
</script>

<div class="mt-4 flex flex-wrap justify-center gap-2">
	<button
		class="btn btn-sm"
		class:btn-primary={metric === 'GDP Per Capita ($)'}
		onclick={() => setMetric('GDP Per Capita ($)')}
	>
		GDP Per Capita ($)
	</button>

	<button
		class="btn btn-sm"
		class:btn-primary={metric === 'Life Expectancy (Years)'}
		onclick={() => setMetric('Life Expectancy (Years)')}
	>
		Life Expectancy
	</button>
</div>

<div
	bind:clientWidth={width}
	bind:clientHeight={height}
	onmousemove={handleMouseCoord}
	class="flex h-full w-full p-2"
	role="region"
	aria-label="Beeswarm chart showing countries by life expectancy and GDP per capita"
>
	<svg {width} {height}>
		<g transform="translate({margin.left}, {margin.top})">
			<text
				x={innerWidth / 2}
				y={(innerHeight * 2) / 3}
				text-anchor="middle"
				class="opacity-50"
				stroke="lightgray"
				style="font-size: {innerWidth / 3}; fill: lightgray"
			>
				{year.value}
			</text>

			{#each nodes as node}
				{#if node.income != null && node.life_exp != null}
					<circle
						cx={node.x}
						cy={node.y}
						r={RADIUS}
						fill={color(node.continent)}
						onmouseover={() => handleChartHover(node)}
						onfocus={() => handleChartHover(node)}
						onmouseleave={handleLeaveChart}
						tabIndex="0"
						role="tooltip"
					/>
				{/if}
			{/each}

			<AxisX {xScale} {innerWidth} {innerHeight} {xTicks} {labelColor} />
			<BeeSwarmY {yScale} {innerHeight} {continents} {labelColor} />
		</g>

		<text
			class="yMeasure"
			x={xLableOffset}
			y={innerHeight / 2 + margin.top}
			text-anchor="middle"
			fill={labelColor}
		>
			Continents
		</text>

		<text
			y={innerHeight + margin.top + 50}
			x={innerWidth / 2 + margin.left}
			text-anchor="middle"
			fill={labelColor}
		>
			{metric}
		</text>
	</svg>
</div>

{#if hoveredData}
	<ScatterTooltip
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
