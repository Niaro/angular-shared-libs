import { Country, Countries, CountryCode } from '../business-domain/countries';

export function booleanMapper(v: any)  {
	return v === 'true' || v === true;
}

export function countryMapper(v: Country | CountryCode) {
	return v instanceof Country ? v : Countries.findByCode(v);
}
