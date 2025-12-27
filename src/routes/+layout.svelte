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

<!-- ROOT -->
<div class="drawer h-screen overflow-hidden">
	<input id="main-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

	<!-- CONTENT -->
	<div class="drawer-content flex h-full min-h-0 flex-col overflow-hidden">
		<!-- NAVBAR -->
		<div class="navbar shrink-0 bg-base-200">
			<div class="navbar-start">
				<label for="main-drawer" class="btn btn-ghost lg:hidden">☰</label>

				<ul class="menu menu-horizontal hidden lg:flex">
					<li>
						<a href="/">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							Home
						</a>
					</li>
					<li>
						<a href="/map">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
								/>
							</svg>

							Map</a
						>
					</li>
					<li>
						<a href="/bar">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
								/>
							</svg>
							Bar</a
						>
					</li>
					<li>
						<a href="/scatterplot">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
								/>
							</svg>

							Scatterplot</a
						>
					</li>
					<li>
						<a href="/beeswarm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>

							Beeswarm</a
						>
					</li>
				</ul>
			</div>

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

		<!-- MAIN -->
		<main class="min-h-0 flex-1 overflow-hidden">
			{@render children({ year, filteredData })}
		</main>

		<!-- YEAR CONTROLS -->
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
				class="range w-4/5 self-center text-blue-300 [--range-bg:blue-400] [--range-fill:0] [--range-thumb:blue-400]"
			/>
		</div>
	</div>

	<!-- DRAWER -->
	<div class="drawer-side">
		<label for="main-drawer" class="drawer-overlay"></label>
		<ul class="menu min-h-full w-64 bg-base-200 p-4">
			<li><a href="/" onclick={() => (drawerOpen = false)}>Home</a></li>
			<li><a href="/map" onclick={() => (drawerOpen = false)}>Map</a></li>
			<li><a href="/bar" onclick={() => (drawerOpen = false)}>Bar</a></li>
			<li><a href="/scatterplot" onclick={() => (drawerOpen = false)}>Scatterplot</a></li>
			<li><a href="/beeswarm" onclick={() => (drawerOpen = false)}>Beeswarm</a></li>
		</ul>
	</div>
</div>
