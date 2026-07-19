<script lang="ts">
	import type { ScaleContinuousNumeric } from 'd3-scale';

	export let yScale: ScaleContinuousNumeric<number, number>;
	export let innerHeight: number;
	export let yTicks: number[];
	export let labelColor: string;
	export let width: number;
</script>

<g>
	<line x1={0} y1={0} x2={0} y2={innerHeight} stroke={labelColor} />
	{#each yTicks as tick}
		<line x1={0} y1={yScale(tick)} y2={yScale(tick)} x2={4} stroke={labelColor} />
		<text
			class="yTicks"
			text-anchor={width < 640 ? 'start' : 'end'}
			y={yScale(tick)}
			dx={width < 640 ? 5 : -5}
			dy={5}
			fill={labelColor}>{tick}</text
		>
	{/each}
</g>

<style>
	.yTicks {
		font-size: 15px;
	}
</style>
