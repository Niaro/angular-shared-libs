import { isNumber } from 'lodash-es';
import * as m from 'moment';

import { Country, Countries, CountryCode } from '../business-domain/countries';

export function booleanMapper(v: any)  {
	return v === 'true' || v === true;
}

export function numberMapper(v: any)  {
	return isNumber(v) && !isNaN(v) ? v : 0;
}

export function countryMapper(v: Country | CountryCode) {
	return v instanceof Country ? v : Countries.findByCode(v);
}

export function unixMomentMapper(v: any) {
	return m.isMoment(v) ? v : m.unix(v)
}

export function momentMapper(v: any) {
	return m.isMoment(v) ? v : m(v);
}
