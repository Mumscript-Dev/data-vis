<script lang="ts">
	import { year } from './state.svelte';
	import type { NumericCountryKey } from '$lib/appConfig/types';
	import { hasNumericValue } from '$lib/helpers/typeGuard';
	import * as d3 from 'd3';
	import { writable } from 'svelte/store';

	type Metric = {
		label: string;
		key: NumericCountryKey;
		max: number;
		format: (v: number) => string;
	};

	const metrics: Metric[] = [
		{ label: 'GDP', key: 'income', max: 150_000, format: (v) => `$${d3.format(',')(v)}` },
		{ label: 'Life Expectancy', key: 'life_exp', max: 90, format: (v) => `${v} yrs` },
		{ label: 'Population', key: 'population', max: 1_400_000_000, format: (v) => d3.format(',')(v) }
	];

	let sortKey = $state<NumericCountryKey>('population');
	let sortDir = $state<'asc' | 'desc'>('desc');

	const mobileMetric = writable<NumericCountryKey>(metrics[0].key);

	let countries = $derived(
		year.filteredData?.countries
			.filter((c) => hasNumericValue(c, sortKey))
			.sort((a, b) =>
				sortDir === 'desc' ? b[sortKey]! - a[sortKey]! : a[sortKey]! - b[sortKey]!
			) ?? []
	);

	const color = d3
		.scaleOrdinal<string>()
		.domain(['americas', 'europe', 'asia', 'africa'])
		.range(d3.schemeSet2);

	const toggleSort = (key: NumericCountryKey) => {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'desc';
		}
	};
</script>

<div class="flex h-full flex-col gap-3 p-4">
	<h1 class="text-lg font-semibold text-primary">
		Country Indicators — {year.value}
	</h1>

	<!-- Mobile Metric Picker -->
	<div class="mb-2 sm:hidden">
		<label for="mobile-metric" class="mr-2 text-sm font-medium">Metric:</label>
		<select id="mobile-metric" bind:value={$mobileMetric} class="rounded border p-1 text-sm">
			{#each metrics as m}
				<option value={m.key}>{m.label}</option>
			{/each}
		</select>
	</div>

	<!-- MOBILE LIST -->
	<div class="flex flex-1 flex-col gap-2 overflow-y-auto sm:hidden">
		{#each countries as row}
			<div class="flex min-w-0 items-center justify-between gap-2 rounded border p-2">
				<!-- Country -->
				<div class="min-w-[90px] flex-shrink-0 font-medium">{row.country}</div>

				<!-- Selected Metric + Bar -->
				{#each metrics.filter((m) => m.key === $mobileMetric) as m}
					<div class="flex min-w-0 flex-1 items-center gap-2">
						<div class="relative h-3 w-full min-w-0 flex-1 rounded bg-base-200">
							<div
								class="absolute inset-y-0 rounded transition-all duration-200"
								style="width: {(row[m.key]! / m.max) * 100}%; background-color: {color(
									row.continent
								)}"
							></div>
						</div>
						<span class="text-xs whitespace-nowrap">{m.format(row[m.key]!)}</span>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<!-- DESKTOP TABLE -->
	<div class="hidden min-h-0 flex-1 overflow-x-auto rounded border sm:block">
		<table class="table-pin-rows table w-full min-w-[640px] table-sm">
			<thead>
				<tr>
					<th>Country</th>
					<th>Continent</th>
					{#each metrics as m}
						<th class="cursor-pointer" onclick={() => toggleSort(m.key)}>
							<div class="flex items-center gap-1">
								{m.label}
								{#if sortKey === m.key}
									<span class="text-xs">{sortDir === 'desc' ? '▼' : '▲'}</span>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each countries as row}
					<tr class="hover">
						<td>{row.country}</td>
						<td class="capitalize">{row.continent}</td>
						{#each metrics as m}
							<td>
								<div class="flex items-center gap-2">
									<div class="relative h-3 w-full max-w-[120px] rounded bg-base-200">
										<div
											class="absolute inset-y-0 rounded transition-all duration-200"
											style="width: {(row[m.key]! / m.max) * 100}%; background-color: {color(
												row.continent
											)}"
										></div>
									</div>
									<span class="text-xs">{m.format(row[m.key]!)}</span>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
