<script lang="ts">
	import type { ScaleBand } from 'd3-scale';

	export let yScale: ScaleBand<string>;
	export let innerHeight: number;
	export let continents: string[];
	export let labelColor: string;
</script>

<g>
	<line x1={0} y1={0} x2={0} y2={innerHeight} stroke={labelColor} />
	{#each continents as continent}
		<line x1={0} y1={yScale(continent)} y2={yScale(continent)} x2={4} stroke={labelColor} />
		<text class="yTicks" text-anchor="middle" y={yScale(continent)} dy={5} dx={-8} fill={labelColor}
			>{continent.charAt(0).toUpperCase() + continent.slice(1)}</text
		>
	{/each}
</g>

<style>
	.yTicks {
		font-size: 18px;
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}
</style>
