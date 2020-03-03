
import * as intlTelInput from 'intl-tel-input';

import { Country } from './country';
import { CountryCode } from './country-codes';

// in order intlTelInputGlobals to be accessible down the code we need invoke a request to the lib,
// otherwise intlTelInputGlobals is undefined
// @ts-ignore
const initiation = intlTelInput;

export class Countries {

	static list = Countries._instanceCountries();

	static worldwide = Country.get('ALL')!;

	private static _lowerCaseCountryNames = Countries.list.map(v => v.lowerCaseName);

	private static _instanceCountries() {
		return [
			...intlTelInputGlobals
				.getCountryData()
				.map(c => {
					// take only actual name of country, like from `Iraq (‫العراق‬‎)` will take `Iraq `;
					const match = c.name.match(/^.+(?=\()/);
					return new Country({
						name: match ? match[ 0 ].trim() : c.name,
						displayName: c.name,
						code: <CountryCode> c.iso2.toUpperCase(),
						dialCode: c.dialCode
					});
				}),
			new Country({ name: 'Worldwide', displayName: 'Worldwide', code: 'ALL' }),
			new Country({ name: 'Antarctica', code: 'AQ', dialCode: '6721' }),
			new Country({ name: 'Bouvet Island', code: 'BV', dialCode: '47' }),
			new Country({ name: 'South Georgia and the South Sandwich Islands', code: 'GS', dialCode: '500' }),
			new Country({ name: 'Heard Island and McDonald Islands', code: 'HM', dialCode: '1672' }),
			new Country({ name: 'Pitcairn', code: 'PN', dialCode: '64' }),
			new Country({ name: 'French Southern Territories', code: 'TF' }),
			new Country({ name: 'United States Minor Outlying Islands', code: 'UM', dialCode: '1808' })
		];
	}

	static find(countryName: string) {
		countryName = countryName.toLowerCase();
		return Countries.list.find(v => v.lowerCaseName === countryName) ?? null;
	}

	static findByCode(code: CountryCode) {
		return Country.get(code) ?? null;
	}

	static findByDialCode(dialCode: string) {
		return Countries.list.find(v => v.dialCode === dialCode);
	}

	static includes(countryName: string) {
		return Countries._lowerCaseCountryNames.includes(countryName.toLowerCase());
	}

	static includesCode(countryCode: CountryCode) {
		return Countries.list.some(v => v.code === countryCode);
	}

}
