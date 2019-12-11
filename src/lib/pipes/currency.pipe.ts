import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { isInteger } from 'lodash-es';

import { CurrencyCode, Currency } from '../models';

@Pipe({
	name: 'bpCurrency'
})
export class BpCurrencyPipe implements PipeTransform {

	/**
	 * if currencyCode is null no currency symbol gets rendered
	 */
	transform(value: number, currencyOrCurrencyCode?: Currency | CurrencyCode) {
		const currency = currencyOrCurrencyCode
			? currencyOrCurrencyCode instanceof Currency ? currencyOrCurrencyCode : new Currency(currencyOrCurrencyCode)
			: undefined;

		return formatCurrency(
			value,
			'en',
			currency?.symbol ?? '',
			'USD',
			isInteger(value) ? '1.0-0' : undefined
		);
	}

}
