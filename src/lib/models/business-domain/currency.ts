import { getCurrencySymbol } from '@angular/common';
import { isString } from 'lodash-es';

import { MetadataEntity } from '../metadata/metadata-entity';
import { MapIncomingValue } from '../metadata/decorators';

// tslint:disable-next-line:max-line-length
const CURRENCIES_CODES = <const>[ 'USD', 'EUR', 'ALL', 'AFN', 'DZD', 'AOA', 'XCD', 'ARS', 'AMD', 'AWG', 'AUD', 'AZN', 'BSD', 'BHD', 'BDT', 'BBD', 'BYN', 'BZD', 'XOF', 'BMD', 'INR', 'BTN', 'BOB', 'BOV', 'BAM', 'BWP', 'NOK', 'BRL', 'BND', 'BGN', 'BIF', 'CVE', 'KHR', 'XAF', 'CAD', 'KYD', 'CLP', 'CLF', 'CNY', 'COP', 'COU', 'KMF', 'CDF', 'NZD', 'CRC', 'HRK', 'CUP', 'CUC', 'ANG', 'CZK', 'DKK', 'DJF', 'DOP', 'EGP', 'SVC', 'ERN', 'ETB', 'FKP', 'FJD', 'XPF', 'GMD', 'GEL', 'GHS', 'GIP', 'GTQ', 'GBP', 'GNF', 'GYD', 'HTG', 'HNL', 'HKD', 'HUF', 'ISK', 'IDR', 'XDR', 'IRR', 'IQD', 'ILS', 'JMD', 'JPY', 'JOD', 'KZT', 'KES', 'KPW', 'KRW', 'KWD', 'KGS', 'LAK', 'LBP', 'LSL', 'ZAR', 'LRD', 'LYD', 'CHF', 'MOP', 'MKD', 'MGA', 'MWK', 'MYR', 'MVR', 'MRU', 'MUR', 'XUA', 'MXN', 'MXV', 'MDL', 'MNT', 'MAD', 'MZN', 'MMK', 'NAD', 'NPR', 'NIO', 'NGN', 'OMR', 'PKR', 'PAB', 'PGK', 'PYG', 'PEN', 'PHP', 'PLN', 'QAR', 'RON', 'RUB', 'RWF', 'SHP', 'WST', 'STN', 'SAR', 'RSD', 'SCR', 'SLL', 'SGD', 'XSU', 'SBD', 'SOS', 'SSP', 'LKR', 'SDG', 'SRD', 'SZL', 'SEK', 'CHE', 'CHW', 'SYP', 'TWD', 'TJS', 'TZS', 'THB', 'TOP', 'TTD', 'TND', 'TRY', 'TMT', 'UGX', 'UAH', 'AED', 'USN', 'UYU', 'UYI', 'UYW', 'UZS', 'VUV', 'VES', 'VND', 'YER', 'ZMW', 'ZWL', 'XBA', 'XBB', 'XBC', 'XBD', 'XTS', 'XXX', 'XAU', 'XPD', 'XPT', 'XAG' ];

export type CurrencyCode = typeof CURRENCIES_CODES[ number ];

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
			throw new Error(`Such currency doesn't exist - ${ this.code }`);

		this.symbol = getCurrencySymbol(this.code, 'narrow');

		Currency._cache.set(this.code, this);

		this.displayName = this.code === this.symbol
			? this.code
			: `${ this.code } ${ this.symbol }`;

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
