import { Country, Countries, CountryCode } from '../business-domain/countries';
import { isNumber } from 'util';

export function booleanMapper(v: any)  {
	return v === 'true' || v === true;
}

export function numberMapper(v: any)  {
	return isNumber(v) && !isNaN(v) ? v : 0;
}

export function countryMapper(v: Country | CountryCode) {
	return v instanceof Country ? v : Countries.findByCode(v);
}
