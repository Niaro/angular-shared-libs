import { kebabCase } from 'lodash-es';

import { Enumeration } from '../../misc';

export class PaymentMethodType extends Enumeration {
	static creditCard = new PaymentMethodType('Credit Card');
	static apm = new PaymentMethodType('APM');
	static crypto = new PaymentMethodType();
	static wireTransfer = new PaymentMethodType('Wire Transfer');
	static voucher = new PaymentMethodType();
	static link = new PaymentMethodType();

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
