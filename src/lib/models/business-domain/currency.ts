import { getCurrencySymbol } from '@angular/common';
import { MetadataEntity } from '../metadata';
import { isString } from 'util';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

const CURRENCIES = new Map<CurrencyCode, Currency>();

export class Currency extends MetadataEntity {
	symbol: string;
	code: CurrencyCode;

	constructor(dataOrCode: Partial<Currency> | CurrencyCode) {
		super(isString(dataOrCode) ? { code: dataOrCode } : dataOrCode);

		if (CURRENCIES.has(this.code))
			return CURRENCIES.get(this.code);

		this.symbol = getCurrencySymbol(this.code, 'narrow');
		if (!this.symbol)
			throw new Error(`Such currency doesn't exist - ${this.code}`);

		CURRENCIES.set(this.code, this);

		Object.freeze(this);
	}
}
