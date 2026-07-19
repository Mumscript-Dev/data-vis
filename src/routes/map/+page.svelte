<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import type { Feature, Geometry } from 'geojson';
	import type { Country, CountryGeoProperties } from '$lib/appConfig/types';
	import { year } from '../state.svelte';
	import ChartTooltip from '$lib/components/ChartTooltip.svelte';
	import type { GeoPath, GeoPermissibleObjects } from 'd3-geo';
	import { createChartHover } from '$lib/store/chartHover'; // <- reusable hover module

	const { data } = $props<{
		data: {
			countriesGeo: Feature<Geometry, CountryGeoProperties>[];
		};
	}>();

	const margin = { top: 20, bottom: 20, left: 20, right: 20 };
	let width = $state(800);
	let height = $state(900);
	let rotation = $state(0);
	let isDragging = $state(false);
	let degreePerFrame = 0.4;
	let globe: SVGSVGElement;

	let innerHeight = $derived(height - margin.top - margin.bottom - 30);
	let innerWidth = $derived(width - margin.left - margin.right);

	let globeWidth = $derived(innerWidth > innerHeight ? innerHeight / 2 : innerWidth / 2);

	let path = $state<GeoPath<any, GeoPermissibleObjects> | null>(null);
	let projection = d3.geoOrthographic();

	$effect(() => {
		projection
			.scale(globeWidth)
			.rotate([rotation, 0])
			.translate([innerWidth / 2, innerHeight / 2]);

		path = d3.geoPath(projection);
	});

	onMount(() => {
		const dragSensitivity = 0.15;
		const myGlobe = d3.select(globe);
		myGlobe.call(
			d3
				.drag<SVGSVGElement, unknown>()
				.on('drag', (event) => {
					isDragging = true;
					rotation = rotation + event.dx * dragSensitivity;
				})
				.on('end', () => {
					isDragging = false;
				})
		);

		const timer = d3.timer(() => {
			if (!isDragging) rotation += degreePerFrame;
		});

		return () => timer.stop();
	});

	const {
		hoveredData,
		mousePointWithMarginOffset,
		handleChartHover,
		handleLeaveChart,
		handleMouseCoord
	} = createChartHover<Country>();

	function getCountryInfo(name: string): Country | null {
		const countries = year?.filteredData?.countries ?? [];
		return countries.find((d) => d.country === name) || null;
	}

	function handleCountryHover(name: string) {
		const country = getCountryInfo(name);
		if (country) handleChartHover(country);
	}
</script>

<div class="mx-4 flex items-center justify-between">
	<h1 class="text-2xl font-bold text-primary">World Map Visualization</h1>
	<span class="text-lg font-medium text-primary">
		Year: {year?.value ?? 'N/A'}
	</span>
</div>

<div
	bind:clientWidth={width}
	bind:clientHeight={height}
	onmousemove={(e) => handleMouseCoord(e, margin)}
	class="h-full w-full p-2"
	role="region"
	aria-label="Interactive world map"
>
	<svg {width} {height} bind:this={globe}>
		<defs>
			<filter id="glow" height="130%">
				<feGaussianBlur in="SourceAlpha" stdDeviation="7.5" />
				<feOffset dx="0" dy="0" result="offsetblur" />
				<feFlood flood-color="rgba(173, 216, 230, .85)" />
				<feComposite in2="offsetblur" operator="in" />
				<feMerge>
					<feMergeNode />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>
		<g transform="translate({margin.left}, {margin.top})">
			<circle
				filter="url('#glow')"
				cx={innerWidth / 2}
				cy={innerHeight / 2}
				r={globeWidth}
				stroke="grey"
				fill="lightblue"
			></circle>

			{#if data?.countriesGeo && path}
				{#each data.countriesGeo as country}
					<path
						d={path(country)}
						class="countries"
						stroke="#787878"
						fill={country.properties.color}
						onmouseover={() => handleCountryHover(country.properties.name)}
						onfocus={() => handleCountryHover(country.properties.name)}
						onmouseleave={handleLeaveChart}
						role="graphics-symbol"
						opacity={0.5}
					/>
				{/each}
			{/if}
		</g>
	</svg>
</div>

<ChartTooltip {hoveredData} {mousePointWithMarginOffset} />
