type Country = {
	continent: string;
	country: string;
	income: null | number;
	life_exp: null | number;
	population: number;
};

type EntryData = {
	year: string;
	countries: Country[];
};

type Row = [string, number];
type Data = Row[];

export type { Country, EntryData, Data };
