
import { mapValues, isString } from 'lodash-es';

import { MetadataEntity, MapIncomingValue } from '@bp/shared/models/metadata';

import states from './states';
import { State } from './state';
import { CountryCode, COUNTRY_CODES } from './country-codes';


const STATES_BY_COUNTRY = <{ [ country in CountryCode ]: State[]; }> <unknown> mapValues(
	states,
	(v: Partial<State>[]) => v.map((it: Partial<State>) => new State(it))
);

export class Country extends MetadataEntity {

	private static _cache = new Map<CountryCode, Country>();

	static get(code: CountryCode): Country | undefined {
		return Country._cache.get(code);
	}

	@MapIncomingValue()
	readonly name!: string;

	@MapIncomingValue()
	readonly displayName!: string;

	@MapIncomingValue()
	readonly code!: CountryCode;

	@MapIncomingValue()
	readonly dialCode!: string;

	readonly lowerCaseName?: string;

	readonly lowerCaseCode?: string;

	readonly states?: State[];

	constructor(dataOrCode: (Partial<Country> & { code: CountryCode; }) | CountryCode) {
		super(isString(dataOrCode)
			? <any> { code: <CountryCode> dataOrCode.toUpperCase() }
			: dataOrCode
		);

		if (Country._cache.has(this.code))
			return Country._cache.get(this.code)!;

		this._whenCountryCodeInvalidThrowNotFoundError();

		this.displayName = this.displayName || this.name;
		this.lowerCaseName = this.name.toLowerCase();
		this.lowerCaseCode = this.code.toLowerCase();
		this.states = STATES_BY_COUNTRY[ this.code ];

		this._cacheAndFreezeInstance();
	}

	private _cacheAndFreezeInstance() {
		Country._cache.set(this.code, this);
		Object.freeze(this);
	}

	private _whenCountryCodeInvalidThrowNotFoundError() {
		if (!COUNTRY_CODES.includes(this.code))
			throw new Error(`Such country doesn't exist - ${ this.code }`);
	}

	valueOf(): any {
		return this.code;
	}

	toJSON() {
		return this.code;
	}

	toString(): any {
		return this.code;
	}
}
