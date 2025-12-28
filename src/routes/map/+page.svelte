<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import type { Feature, Geometry } from 'geojson';
	import type { Country } from '$lib/appConfig/types';
	import { year } from '../state.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import type { GeoPath, GeoPermissibleObjects } from 'd3-geo';

	const { data } = $props<{
		data: {
			countriesGeo: Feature<Geometry, { name: string; color?: string }>[];
		};
	}>();

	const margin = { top: 20, bottom: 20, left: 20, right: 20 };
	let width = $state(800);
	let height = $state(900);
	let rotation = $state(0);
	let isDragging = $state(false);
	let degreePerFrame = 0.4;
	let globe: any;
	let countriesGeo = $derived(data.countriesGeo);
	let innerHeight = $derived(height - margin.top - margin.bottom - 30);
	let innerWidth = $derived(width - margin.left - margin.right);
	const continents = ['americas', 'europe', 'asia', 'africa'];
	let globeWidth = $derived(innerWidth > innerHeight ? innerHeight / 2 : innerWidth / 2);

	const t = d3.timer((elapsed) => {
		if (isDragging) return;
		rotation += degreePerFrame;
	});
	let projection;
	let path = $state<GeoPath<any, GeoPermissibleObjects> | null>(null);

	$effect(() => {
		projection = d3
			.geoOrthographic()
			.scale(globeWidth)
			.rotate([rotation, 0])
			.translate([innerWidth / 2, innerHeight / 2]);
		path = d3.geoPath(projection);
	});

	onMount(async () => {
		const dragSensitivity = 0.15;
		const myGlobe = d3.select(globe);
		myGlobe.call(
			d3
				.drag()
				.on('drag', (event) => {
					isDragging = true;
					rotation = rotation + event.dx * dragSensitivity;
				})
				.on('end', (event) => {
					isDragging = false;
				})
		);
	});
	let hoveredCountry: null | Country = $state(null);
	function getCountryInfo(country: string, data: Country[]) {
		console.log(data.find((d) => d.country === country));
		return data.find((d) => d.country === country) || null;
	}
	let handleCircleHover = $derived((country: string, data: Country[]) => {
		hoveredCountry = getCountryInfo(country, data);
	});
	const handleLeaveChart = () => {
		hoveredCountry = null;
	};
	let mousePointWithMarginOffset = $state({ x: 0, y: 0 });
	function handleMouseCoord(event: any) {
		mousePointWithMarginOffset.x = event.pageX - margin.left - margin.right;
		mousePointWithMarginOffset.y = event.pageY - margin.top - margin.bottom;
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
	onmousemove={handleMouseCoord}
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
				<feMerge> <feMergeNode /> <feMergeNode in="SourceGraphic" /> </feMerge>
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
			{#if countriesGeo && path}
				{#each countriesGeo as country}
					<path
						d={path(country)}
						class="countries"
						stroke="#787878"
						fill={country.properties.color}
						onmouseover={() =>
							handleCircleHover(country.properties.name, year?.filteredData?.countries ?? [])}
						onfocus={() =>
							handleCircleHover(country.properties.name, year?.filteredData?.countries ?? [])}
						onmouseleave={() => handleLeaveChart()}
						role="tooltip"
						opacity={0.5}
					/>
				{/each}
			{/if}
		</g>
	</svg>
</div>

{#if hoveredCountry}
	<Tooltip
		data={hoveredCountry}
		xPosition={mousePointWithMarginOffset.x}
		yPosition={mousePointWithMarginOffset.y}
	/>
{/if}
