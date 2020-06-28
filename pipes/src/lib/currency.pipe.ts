import { isInteger, isNil } from 'lodash-es';

import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { Currency, CurrencyCode } from '@bp/shared/models/currencies';

@Pipe({
	name: 'bpCurrency'
})
export class BpCurrencyPipe implements PipeTransform {

	/**
	 * if currencyCode is null no currency symbol gets rendered
	 */
	transform(value: number | null, currencyOrCurrencyCode?: Currency | CurrencyCode | null) {
		if (isNil(value))
			return '';

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
