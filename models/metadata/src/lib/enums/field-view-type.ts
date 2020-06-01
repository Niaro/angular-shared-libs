import { Enumeration } from '@bp/shared/models/core';

export class FieldViewType extends Enumeration {
	// general
	static text = new FieldViewType();

	static textarea = new FieldViewType();

	static boolean = new FieldViewType();

	static booleanCircle = new FieldViewType();

	static currency = new FieldViewType();

	static percent = new FieldViewType();

	static moment = new FieldViewType();

	static email = new FieldViewType();

	static chip = new FieldViewType();

	static link = new FieldViewType();

	static thumbnail = new FieldViewType();

	// special
	static currencyCode = new FieldViewType();

	static cryptoCurrency = new FieldViewType();

	static country = new FieldViewType();

	static paymentMethodBrand = new FieldViewType();

	static status = new FieldViewType();
}
