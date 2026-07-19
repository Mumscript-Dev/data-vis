export const CONTINENTS: string[] = ['americas', 'europe', 'asia', 'africa'];

export const LABEL_COLOR = '#55bcd9';

// GDP per capita domain/ticks used by log-scale axes (Beeswarm, Scatterplot)
export const GDP_DOMAIN: [number, number] = [140, 170000];
export const GDP_TICKS = [140, 400, 4000, 40000, 170000];

// GDP per capita domain used where the data is pre-filtered to positive incomes (Bar, Home)
export const GDP_LOG_DOMAIN: [number, number] = [1400, 150000];

export const LIFE_EXP_DOMAIN: [number, number] = [0, 90];
export const LIFE_EXP_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

export const POPULATION_DOMAIN: [number, number] = [2000, 1_400_000_000];

export const responsiveChartMargin = (width: number) => ({
	top: 20,
	bottom: 120,
	left: width < 640 ? 20 : 80,
	right: width < 640 ? 20 : 80
});

export const xLabelOffset = (width: number) => (width < 640 ? 10 : 40);
