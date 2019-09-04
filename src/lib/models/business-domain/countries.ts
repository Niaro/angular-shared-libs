import { CountryCode as ActualCountryCode } from 'libphonenumber-js';
import * as intlTelInput from 'intl-tel-input';
import { mapValues } from 'lodash-es';

import { MetadataEntity } from '../metadata/metadata-entity';
import { State } from './state';

export type CountryCode = ActualCountryCode | 'AQ' | 'BV' | 'GS' | 'HM' | 'PN' | 'TF' | 'UM';

// in order intlTelInputGlobals to be accessible down the code we need invoke a request to the lib,
// otherwise intlTelInputGlobals is undefined
// @ts-ignore
const initiation = intlTelInput;

export const COUNTRY_STATES: { [countryIso: string]: State[] } = mapValues(
	require('./states.json'),
	(v: Partial<State>[]) => v.map((it: Partial<State>) => new State(it))
);

export class Country extends MetadataEntity {
	readonly name: string;
	readonly displayName: string;
	readonly code: CountryCode | 'ALL';
	readonly dialCode: string;
	readonly lowerCaseName?: string;
	readonly lowerCaseCode?: string;
	readonly states?: State[];

	constructor(data: Partial<Country>) {
		super(data);
		this.displayName = this.displayName || this.name;
		this.lowerCaseName = this.name.toLowerCase();
		this.lowerCaseCode = this.code.toLowerCase();
		this.states = COUNTRY_STATES[this.code];
		Object.freeze(this);
	}

	valueOf(): any {
		return this.code;
	}

	toJSON() {
		return this.code;
	}
}

export class Countries {
	static list = [
		...intlTelInputGlobals
			.getCountryData()
			.map(c => {
				const match = c.name.match(/^.+(?=\()/); // take only actual name of country, like from `Iraq (‫العراق‬‎)` will take `Iraq `;
				return new Country({
					name: match ? match[0].trim() : c.name,
					displayName: c.name,
					code: c.iso2.toUpperCase() as CountryCode,
					dialCode: c.dialCode
				});
			}),
		new Country({
			name: 'Antarctica',
			code: 'AQ',
			dialCode: '6721'
		}),
		new Country({
			name: 'Bouvet Island',
			code: 'BV',
			dialCode: '47'
		}),
		new Country({
			name: 'South Georgia and the South Sandwich Islands',
			code: 'GS',
			dialCode: '500'
		}),
		new Country({
			name: 'Heard Island and McDonald Islands',
			code: 'HM',
			dialCode: '1672'
		}),
		new Country({
			name: 'Pitcairn',
			code: 'PN',
			dialCode: '64'
		}),
		new Country({
			name: 'French Southern Territories',
			code: 'TF'
		}),
		new Country({
			name: 'United States Minor Outlying Islands',
			code: 'UM',
			dialCode: '1808'
		})
	];

	static worldwide = new Country({ name: 'Worldwide', displayName: 'Worldwide', code: 'ALL' });

	private static countryByCountryCode = new Map<CountryCode, Country>(Countries.list
		.map(it => [it.code, it] as [CountryCode, Country])
	);
	private static countryNames = Countries.list.map(v => v.name.toLowerCase());

	static find(countryName: string) {
		countryName = countryName.toLowerCase();
		return this.list.find(v => v.lowerCaseName === countryName)
			|| (Countries.worldwide.lowerCaseName === countryName ? this.worldwide : null);
	}

	static findByCode(code: CountryCode | string) {
		return this.countryByCountryCode.get(<CountryCode>code)
			|| (Countries.worldwide.code === code ? this.worldwide : null);
	}

	static findByDialCode(dialCode: string) {
		return this.list.find(v => v.dialCode === dialCode);
	}

	static includes(countryName: string) {
		return this.countryNames.includes(countryName.toLowerCase());
	}

	static includesCode(countryCode: CountryCode) {
		return this.list.some(v => v.code === countryCode);
	}
}
