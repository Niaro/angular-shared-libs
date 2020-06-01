import { isString } from 'lodash-es';

import { Enumeration } from '@bp/shared/models/core';

export class PaymentMethodBrand extends Enumeration {
	// #region Credit Cards
	static maestro = new PaymentMethodBrand();

	static hypercard = new PaymentMethodBrand();

	static elo = new PaymentMethodBrand();

	static forbrugsforeningen = new PaymentMethodBrand();

	static dankort = new PaymentMethodBrand();

	static visa = new PaymentMethodBrand();

	static masterCard = new PaymentMethodBrand('MasterCard');

	static amex = new PaymentMethodBrand();

	static diners = new PaymentMethodBrand();

	static discover = new PaymentMethodBrand();

	static jcb = new PaymentMethodBrand();
	// #endregion Credit Cards

	// #region Apms
	static chinaUnionPay = new PaymentMethodBrand('China Union Pay');

	static aliPay = new PaymentMethodBrand('Ali Pay');

	static weChat = new PaymentMethodBrand('WeChat wallet');

	static payPal = new PaymentMethodBrand('PayPal');

	static netteller = new PaymentMethodBrand();

	static skrill = new PaymentMethodBrand();

	static applePay = new PaymentMethodBrand('Apple Pay');

	static googlePay = new PaymentMethodBrand('Google Pay');

	static brainTree = new PaymentMethodBrand('BrainTree');

	static yandex = new PaymentMethodBrand();
	// #endregion Apms

	// #region Vouchers
	static vload = new PaymentMethodBrand();
	// #endregion Vouchers

	// #region Ewallet

	static epayments = new PaymentMethodBrand();
	static revolut = new PaymentMethodBrand();
	// #endregion Ewallet

	static parse(value: string | PaymentMethodBrand): PaymentMethodBrand | null {
		if (isString(value) && value.toLowerCase().startsWith('master'))
			return PaymentMethodBrand.masterCard;

		return super.parse(value);
	}
}
