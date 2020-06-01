import { CountryCode } from './country-codes';
import { Country } from './country';
import { State } from './state';
import { Countries } from './countries';

export function countryMapper(v: Country | CountryCode) {
	return v instanceof Country ? v : Countries.findByCode(v);
}

export function stateMapper(state: string | State, _data: any, { country: country }: { country: Country; }) {
	if (state instanceof State)
		return state;

	state = state.toUpperCase();

	return state && country?.states?.find(it => it.code === state) || null;
}
