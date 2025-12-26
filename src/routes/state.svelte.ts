import data from '$lib/data/data.json';
import { type EntryData } from '$lib/appConfig/types';

class YearState {
	value = $state(1800);
	filteredData = $derived(
		(data as EntryData[]).find((row: EntryData) => row.year === this.value.toString())
	);

	reset() {
		this.value = 1800;
	}

	up() {
		this.value += 1;
	}
	set(newYear: number) {
		this.value = newYear;
	}
}

export const year = new YearState();
