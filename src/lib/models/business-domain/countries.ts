import { CountryCode } from 'libphonenumber-js';
import * as intlTelInput from 'intl-tel-input';
import { assign } from 'lodash-es';

// in order intlTelInputGlobals to be accessible down the code we need invoke a request to the lib,
// otherwise intlTelInputGlobals is undefined
// @ts-ignore
const initiation = intlTelInput;

export { CountryCode };

export class Country {
	readonly name: string;
	readonly displayName: string;
	readonly code: CountryCode;
	readonly dialCode: string;
	readonly lowerCaseName?: string;
	readonly lowerCaseCode?: string;

	constructor(data: Country) {
		assign(this, data);
		this.lowerCaseName = this.name.toLowerCase();
		this.lowerCaseCode = this.code.toLowerCase();
		Object.freeze(this);
	}
}

export class Countries {
	static list = intlTelInputGlobals
		.getCountryData()
		.map(c => {
			const match = c.name.match(/^.+(?=\()/); // take only actual name of country, like from `Iraq (‫العراق‬‎)` will take `Iraq `;
			return new Country({
				name: match ? match[0].trim() : c.name,
				displayName: c.name,
				code: c.iso2.toUpperCase() as CountryCode,
				dialCode: c.dialCode
			});
		});

	private static countryByCountryCode = new Map<CountryCode, Country>(Countries.list
		.map(it => [it.code, it] as [CountryCode, Country])
	);
	private static countryNames = Countries.list.map(v => v.name.toLowerCase());

	static find(countryName: string) {
		countryName = countryName.toLowerCase();
		return this.list.find(v => v.name.toLowerCase() === countryName);
	}

	static findByCode(code: CountryCode) {
		return this.countryByCountryCode.get(code);
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

export interface IStates {
	[stateCode: string]: string;
}
