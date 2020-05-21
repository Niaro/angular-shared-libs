import { isString } from 'lodash-es';

import { MetadataEntity, MapIncomingValue } from '@bp/shared/models/metadata';

import { Country, Countries, CountryCode } from '../countries';

export class CashierLanguage extends MetadataEntity {

	@MapIncomingValue()
	readonly iso!: string;

	@MapIncomingValue()
	readonly country!: Country;

	@MapIncomingValue()
	readonly name!: string;

	readonly lowerCaseName?: string;

	constructor(dataOrIso: Partial<CashierLanguage> | string) {
		super(isString(dataOrIso) ? { iso: dataOrIso } : dataOrIso);

		this.lowerCaseName = this.name.toLowerCase();

		if (!this.country)
			this.country = Countries.findByCode(<CountryCode> this.iso.toUpperCase())!;
	}

	toString(): any {
		return this.iso;
	}

	valueOf(): any {
		return this.iso;
	}

	toJSON() {
		return this.iso;
	}
}

export class CashierLanguages {
	static list = [
		new CashierLanguage({ iso: 'en', name: 'English', country: Countries.findByCode('GB')! }),
		new CashierLanguage({ iso: 'fr', name: 'French (Français)' }),
		new CashierLanguage({ iso: 'de', name: 'German (Deutsche)' }),
		new CashierLanguage({ iso: 'es', name: 'Spanish (Español)' }),
		new CashierLanguage({ iso: 'ru', name: 'Russian (Русский)' }),
		new CashierLanguage({ iso: 'pt', name: 'Portuguese (Português)' }),
		new CashierLanguage({ iso: 'zh', name: 'Chinese (中文)', country: Countries.findByCode('CN')! }),
		new CashierLanguage({ iso: 'ar', name: 'Arabic (العَرَبِيَّة)', country: Countries.findByCode('AE')! }),
	];

	private static _langByIsoCode = new Map<string, CashierLanguage>(CashierLanguages.list
		.map(it => <[ string, CashierLanguage ]>[ it.iso, it ])
	);

	private static _langNames = CashierLanguages.list.map(v => v.lowerCaseName);

	static find(langName: string) {
		langName = langName.toLowerCase();
		return CashierLanguages.list.find(v => v.lowerCaseName === langName);
	}

	static findByIso(iso: string) {
		return CashierLanguages._langByIsoCode.get(iso);
	}

	static includes(langName: string) {
		return CashierLanguages._langNames.includes(langName.toLowerCase());
	}

	static includesIso(iso: string) {
		return CashierLanguages.list.some(v => v.iso === iso);
	}
}
