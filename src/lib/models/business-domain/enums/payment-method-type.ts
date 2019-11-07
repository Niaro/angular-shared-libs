import { kebabCase } from 'lodash-es';

import { Enumeration } from '../../misc';

export class PaymentMethodType extends Enumeration {
	static creditCard = new PaymentMethodType('Credit Card');
	static apm = new PaymentMethodType('APM');
	static crypto = new PaymentMethodType();
	static wireTransfer = new PaymentMethodType('Wire Transfer');
	static voucher = new PaymentMethodType();
	static externalLink = new PaymentMethodType();
	static cryptoWallet = new PaymentMethodType('Crypto Wallets');

	logo!: string;

	routeName!: string;

	constructor(displayName?: string) {
		super(displayName);

		queueMicrotask(() => {
				this.routeName = kebabCase(this.name);
				this.logo = `assets/images/payment-methods/${this.routeName}`;
			});
	}
}
