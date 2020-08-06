import { isString } from 'lodash-es';

import { getCurrencySymbol } from '@angular/common';

import { MapIncomingValue, MetadataEntity } from '@bp/shared/models/metadata';

import { CURRENCIES_CODES, CurrencyCode } from './currency-codes';

let intlGetDisplayName: { of(iso: string): string; };

function tryGetCurrencyNameInEnglish(this: any, iso: string): string | null {
	try {
		return (intlGetDisplayName
			|| (intlGetDisplayName = new (<any> Intl).DisplayNames([ 'en' ], { type: 'currency' })))
			.of(iso) ?? null;
	} catch (error) {

		return null;
	}
}

export class Currency extends MetadataEntity {

	static list: Currency[];

	private static _cache = new Map<CurrencyCode, Currency>();

	@MapIncomingValue()
	readonly symbol!: string;

	@MapIncomingValue()
	readonly code!: CurrencyCode;

	/**
	 * '{symbol} {code}'
	 */
	readonly displayName!: string;

	constructor(dataOrCode: (Partial<Currency> & { code: CurrencyCode; }) | CurrencyCode) {
		super(isString(dataOrCode)
			? <any> { code: <CurrencyCode> dataOrCode.toUpperCase() }
			: dataOrCode
		);

		if (Currency._cache.has(this.code))
			return <Currency> Currency._cache.get(this.code);

		if (!CURRENCIES_CODES.includes(this.code))
			throw new Error(`Such currency doesn't exist - "${ this.code }"`);

		this.symbol = getCurrencySymbol(this.code, 'narrow');

		Currency._cache.set(this.code, this);

		this.displayName = tryGetCurrencyNameInEnglish(this.code)
			?? (this.code === this.symbol ? this.code : `${ this.code } ${ this.symbol }`);

		Object.freeze(this);
	}

	toString(): any {
		return this.code;
	}

	valueOf(): any {
		return this.code;
	}

	toJSON() {
		return this.code;
	}
}

Currency.list = CURRENCIES_CODES.map(it => new Currency(<any> it));

Object.freeze(Currency.list);
