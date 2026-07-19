<script lang="ts">
	import type { ScaleContinuousNumeric } from 'd3-scale';

	export let xScale: ScaleContinuousNumeric<number, number>;
	export let innerWidth: number;
	export let innerHeight: number;
	export let xTicks: number[];
	export let labelColor: string;
</script>

<g>
	<line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke={labelColor} />
	{#each xTicks as tick}
		<line
			x1={xScale(tick)}
			y1={innerHeight}
			x2={xScale(tick)}
			y2={innerHeight - 5}
			stroke={labelColor}
		/>
		<text x={xScale(tick)} y={innerHeight + 20} text-anchor="middle" fill={labelColor}>{tick}</text>
	{/each}
</g>
