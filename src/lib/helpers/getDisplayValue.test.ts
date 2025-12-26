import { getDisplayValue, getNumberOfDigits } from './getDisplayValue';
import { describe, it, expect } from 'vitest';

describe('getNumberOfDigits', () => {
	it('should return the correct number of digits for positive integers', () => {
		expect(getNumberOfDigits(0)).toBe(1);
		expect(getNumberOfDigits(1)).toBe(1);
		expect(getNumberOfDigits(10)).toBe(2);
		expect(getNumberOfDigits(123)).toBe(3);
		expect(getNumberOfDigits(1234567890)).toBe(10);
	});

	it('should return the correct number of digits for negative integers', () => {
		expect(getNumberOfDigits(-1)).toBe(1);
		expect(getNumberOfDigits(-10)).toBe(2);
		expect(getNumberOfDigits(-123)).toBe(3);
		expect(getNumberOfDigits(-1234567890)).toBe(10);
	});

	it('should handle floating point numbers by treating them as integers for digit counting', () => {
		expect(getNumberOfDigits(1.23)).toBe(1);
		expect(getNumberOfDigits(-1.23)).toBe(1);
	});
});

describe('getDisplayValue', () => {
	it('should return the number as is for values less than 1000', () => {
		expect(getDisplayValue(0)).toBe('0');
		expect(getDisplayValue(123)).toBe('123');
		expect(getDisplayValue(999)).toBe('999');
	});

	it('should format values in thousands (k)', () => {
		expect(getDisplayValue(1000)).toBe('1.00k');
		expect(getDisplayValue(1234)).toBe('1.23k');
		expect(getDisplayValue(999999)).toBe('1000.00k'); // 999.999k rounded to 1000.00k
	});

	it('should format values in millions (m)', () => {
		expect(getDisplayValue(1000000)).toBe('1.00m');
		expect(getDisplayValue(1234567)).toBe('1.23m');
	});

	it('should format values in billions (b)', () => {
		expect(getDisplayValue(1000000000)).toBe('1.00b');
		expect(getDisplayValue(1234567890)).toBe('1.23b');
	});
});
