import { kebabCase } from 'lodash-es';

import { Enumeration } from '../../misc';

export class PaymentMethodType extends Enumeration {
	static creditCard = new PaymentMethodType('Credit Card');
	static crypto = new PaymentMethodType();
	static apm = new PaymentMethodType('APM');
	static voucher = new PaymentMethodType();
	static wireTransfer = new PaymentMethodType('Wire Transfer');
	static eWallet = new PaymentMethodType('EWallet');
	static alipay = new PaymentMethodType();
	static banks = new PaymentMethodType();

	// for the cashier demo
	static jcb = new PaymentMethodType();
	static paypal = new PaymentMethodType();
	static chinaUnionPay = new PaymentMethodType();

	logo: string;

	routeName: string;

	constructor(displayName?: string) {
		super(displayName);

		Promise
			.resolve()
			.then(() => {
				this.routeName = kebabCase(this.name);
				this.logo = `assets/images/payment-methods/${this.routeName}`;
			});
	}
}
