import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Generic type for hovered data
export function createChartHover<T>() {
	// Store for hovered data
	const hoveredData: Writable<T | null> = writable(null);

	// Store for mouse coordinates relative to chart margins
	const mousePointWithMarginOffset: Writable<{ x: number; y: number }> = writable({ x: 0, y: 0 });

	// Handlers
	const handleChartHover = (data: T) => {
		hoveredData.set(data);
	};

	const handleLeaveChart = () => {
		hoveredData.set(null);
	};

	const handleMouseCoord = (
		event: MouseEvent,
		margin: { top: number; right: number; bottom: number; left: number }
	) => {
		mousePointWithMarginOffset.set({
			x: event.pageX - margin.left - margin.right,
			y: event.pageY - margin.top - margin.bottom
		});
	};

	return {
		hoveredData,
		mousePointWithMarginOffset,
		handleChartHover,
		handleLeaveChart,
		handleMouseCoord
	};
}
