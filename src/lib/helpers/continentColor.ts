import * as d3 from 'd3';
import { CONTINENTS } from '$lib/appConfig/chartConfig';

export const continentColor = d3.scaleOrdinal<string>().domain(CONTINENTS).range(d3.schemeSet2);
