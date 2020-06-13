import { COUNTRIES_BY_REGION } from './countries-by-region';
import { COUNTRIES_BY_SUBREGION } from './countries-by-sub-region';

export const COUNTRIES_BY_REGION_AND_SUBREGION = {
	...COUNTRIES_BY_REGION,
	...COUNTRIES_BY_SUBREGION
};
