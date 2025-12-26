export const getNumberOfDigits = (num: number): number => {
	if (Math.abs(num) === num) return num.toString().split('.')[0].length;

	return num.toString().split('.')[0].length - 1;
};

export const getDisplayValue = (value: number) => {
	const trimedValue = Math.round(value);
	const digits = getNumberOfDigits(trimedValue);
	if (digits < 4) return `${trimedValue}`;

	if (digits < 7) return `${(value / 1000).toFixed(2)}k`;

	if (digits < 10) return `${(value / 1000000).toFixed(2)}m`;

	return `${(trimedValue / 1000000000).toFixed(2)}b`;
};
