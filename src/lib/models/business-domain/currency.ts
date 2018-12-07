import { getCurrencySymbol } from '@angular/common';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

const CURRENCIES = new Map<CurrencyCode, Currency>();

export class Currency {
	symbol: string;

	constructor(public code: CurrencyCode) {
		if (CURRENCIES.has(code))
			return CURRENCIES.get(code);

		this.symbol = getCurrencySymbol(this.code, 'narrow');
		if (!this.symbol)
			throw new Error(`Such currency doesn't exist - ${code}`);

		CURRENCIES.set(code, this);

		Object.freeze(this);
	}
}
