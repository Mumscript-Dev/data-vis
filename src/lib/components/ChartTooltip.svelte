<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Country } from '$lib/appConfig/types';
	import Tooltip from './Tooltip.svelte';

	export let hoveredData: Writable<Country | null>;
	export let mousePointWithMarginOffset: Writable<{ x: number; y: number }>;
</script>

{#if $hoveredData}
	<Tooltip
		data={$hoveredData}
		xPosition={$mousePointWithMarginOffset.x}
		yPosition={$mousePointWithMarginOffset.y}
	/>
{/if}
