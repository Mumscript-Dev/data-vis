// +page.server.ts
import type { PageServerLoad } from './$types';
import world from '$lib/data/world';
import { feature } from 'topojson-client';
import type { Feature, Geometry, FeatureCollection } from 'geojson';
import type { CountryGeoProperties } from '$lib/appConfig/types';

export const load: PageServerLoad = async () => {
	const geo:
		| Feature<Geometry, CountryGeoProperties>
		| FeatureCollection<Geometry, CountryGeoProperties> = feature(world, world.objects.countries);

	const countriesGeo: Feature<Geometry, CountryGeoProperties>[] =
		geo.type === 'FeatureCollection' ? geo.features : [geo];

	return { countriesGeo };
};
