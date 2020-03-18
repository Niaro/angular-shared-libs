import { isNumber } from 'lodash-es';
import * as m from 'moment';

import { Country, Countries, CountryCode, State } from '../business-domain/countries';
import { CashierLanguage, CashierLanguages } from '../business-domain/cashier-languages';

export function booleanMapper(v: any) {
	return v === 'true' || v === true;
}

export function numberMapper(v: any) {
	return isNumber(v) && !isNaN(v) ? v : 0;
}

export function countryMapper(v: Country | CountryCode) {
	return v instanceof Country ? v : Countries.findByCode(v);
}

export function stateMapper(state: string | State, _data: any, { country: country }: { country: Country; }) {
	if (state instanceof State)
		return state;

	state = state.toUpperCase();

	return state && country?.states?.find(it => it.code === state) || null;
}

export function cashierLangMapper(v: CashierLanguage | string) {
	return v instanceof CashierLanguage ? v : CashierLanguages.findByIso(v);
}

export function unixMomentMapper(v: any) {
	return m.isMoment(v) ? v : m.unix(v);
}

export function momentMapper(v: any) {
	return m.isMoment(v) ? v : m(v);
}
