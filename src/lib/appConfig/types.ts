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

type NumericCountryKey = 'population' | 'life_exp' | 'income';

type CountryGeoProperties = {
	name: string;
	color?: string;
};

export type { Country, EntryData, Data, Row, NumericCountryKey, CountryGeoProperties };
