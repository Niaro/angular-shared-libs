import { Enumeration } from '../../misc/enum';

export class FieldViewType extends Enumeration {
	// general
	static text = new FieldViewType();

	static boolean = new FieldViewType();

	static money = new FieldViewType();

	static moment = new FieldViewType();

	static email = new FieldViewType();

	// special
	static currency = new FieldViewType();

	static cryptoCurrency = new FieldViewType();

	static country = new FieldViewType();

	static paymentMethodBrand = new FieldViewType();

	static status = new FieldViewType();
}
