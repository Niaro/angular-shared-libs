import { kebabCase } from 'lodash-es';

import { lineMicrotask } from '@bp/shared/utils';

import { Enumeration } from '../../misc';

export class PaymentMethodType extends Enumeration {

	static creditCard = new PaymentMethodType('Credit Card');

	static apm = new PaymentMethodType('APM');

	static crypto = new PaymentMethodType();

	static wireTransfer = new PaymentMethodType('Wire Transfer');

	static voucher = new PaymentMethodType();

	static externalLink = new PaymentMethodType();

	static cryptoWallet = new PaymentMethodType('Crypto Wallets');

	static staticPages = new PaymentMethodType();

	static staticPagesMethods = [
		PaymentMethodType.wireTransfer,
		PaymentMethodType.cryptoWallet
	];

	logo!: string;

	routeName!: string;

	constructor(displayName?: string) {
		super(displayName);

		lineMicrotask(() => {
			this.routeName = kebabCase(this.name);
			this.logo = `assets/images/payment-methods/${this.routeName}`;
		});
	}
}
