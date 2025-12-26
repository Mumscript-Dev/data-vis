<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import data from '$lib/data/data.json';
	import { year } from './state.svelte';
	type ChildProps = {
		year: number;
		filteredData: any;
	};

	let { children } = $props<{
		children: (props: ChildProps) => any;
	}>();

	let years = $derived(data.map((row: any) => parseInt(row.year)));
	let filteredData = $derived(data.find((row: any) => row.year === year.toString()));
	$inspect(year.value, 'year in layout');
	let interval: any;
	let isRunning = false;
	let drawerOpen = $state(false);

	const yearIncrement = () => {
		if (isRunning) return;

		isRunning = true;
		interval = setInterval(() => {
			if (year.value < 2014) {
				year.up();
			} else {
				clearInterval(interval);
				isRunning = false;
				year.reset();
			}
		}, 200);
	};

	const pauseYear = () => {
		isRunning = false;
		clearInterval(interval);
	};

	const resetYear = () => {
		isRunning = false;
		clearInterval(interval);
		year.reset();
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- DAISYUI DRAWER -->
<div class="drawer min-h-screen">
	<input id="main-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

	<!-- PAGE CONTENT -->
	<div class="drawer-content flex flex-col">
		<!-- NAVBAR -->
		<div class="navbar bg-base-200">
			<div class="navbar-start">
				<!-- Burger (mobile only) -->
				<label for="main-drawer" class="btn btn-ghost lg:hidden"> ☰ </label>

				<!-- Desktop menu -->
				<ul class="menu menu-horizontal hidden lg:flex">
					<li><a href="/map">Map</a></li>
					<li><a href="/bar">Bar</a></li>
					<li><a href="/scatterplot">Scatterplot</a></li>
					<li><a href="/beeswarm">Beeswarm</a></li>
				</ul>
			</div>

			<!-- THEME TOGGLE -->
			<div class="navbar-end">
				<label class="swap swap-rotate">
					<!-- this hidden checkbox controls the state -->
					<input type="checkbox" class="theme-controller" value="synthwave" />

					<!-- sun icon -->
					<svg
						class="swap-off h-8 w-8 fill-current"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
						/>
					</svg>

					<!-- moon icon -->
					<svg
						class="swap-on h-8 w-8 fill-current"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
						/>
					</svg>
				</label>
			</div>
		</div>

		<!-- MAIN CONTENT -->
		<div class="flex flex-1 flex-col overflow-hidden">
			{@render children({ year, filteredData })}
		</div>
		<div class="mx-2 mb-2 flex shrink-0 flex-row justify-center gap-4 pt-2">
			<div class="mb-2 flex shrink-0 flex-row justify-center gap-4 pt-2">
				<button class="btn btn-xs" onclick={yearIncrement}>▶</button>
				<button class="btn btn-xs" onclick={pauseYear}>⏸</button>
				<button class="btn btn-xs" onclick={resetYear}>⟲</button>
			</div>
			<input
				type="range"
				min={Math.min(...years)}
				max={Math.max(...years)}
				bind:value={year.value}
				class="range w-4/5 self-center text-blue-300 [--range-bg:orange] [--range-fill:0] [--range-thumb:blue]"
			/>
		</div>
	</div>

	<!-- DRAWER MENU -->
	<div class="drawer-side">
		<label for="main-drawer" class="drawer-overlay"></label>
		<ul class="menu min-h-full w-64 bg-base-200 p-4">
			<li><a href="/map" onclick={() => (drawerOpen = false)}>Map</a></li>
			<li><a href="/bar" onclick={() => (drawerOpen = false)}>Bar</a></li>
			<li>
				<a href="/scatterplot" onclick={() => (drawerOpen = false)}> Scatterplot </a>
			</li>
			<li>
				<a href="/beeswarm" onclick={() => (drawerOpen = false)}> Beeswarm </a>
			</li>
		</ul>
	</div>
</div>
