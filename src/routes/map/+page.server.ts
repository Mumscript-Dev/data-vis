// +page.server.ts
import type { PageServerLoad } from './$types';
import world from '$lib/data/world';
import { feature } from 'topojson-client';
import type { Feature, Geometry, FeatureCollection } from 'geojson';
import type { Topology, GeometryCollection } from 'topojson-specification';

type CountryProps = {
	name: string;
	color?: string;
};

const topology = world as unknown as Topology<{
	countries: GeometryCollection<CountryProps>;
}>;

export const load: PageServerLoad = async () => {
	const geo: Feature<Geometry, CountryProps> | FeatureCollection<Geometry, CountryProps> = feature(
		topology,
		topology.objects.countries
	);

	const countriesGeo: Feature<Geometry, CountryProps>[] =
		geo.type === 'FeatureCollection' ? geo.features : [geo];

	return { countriesGeo };
};
