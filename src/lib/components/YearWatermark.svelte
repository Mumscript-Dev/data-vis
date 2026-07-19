<script lang="ts">
	export let year: number;
	export let innerWidth: number;
	export let innerHeight: number;
</script>

<text
	x={innerWidth / 2}
	y={(innerHeight * 2) / 3}
	text-anchor="middle"
	class="opacity-50"
	stroke="lightgray"
	style="font-size: {innerWidth / 3}; fill: lightgray">{year}</text
>
