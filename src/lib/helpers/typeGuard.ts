import type { Country } from '$lib/appConfig/types';
function hasNumericValue<K extends keyof Country>(
	row: Country,
	key: K
): row is Country & Record<K, number> {
	return typeof row[key] === 'number';
}
export { hasNumericValue };
