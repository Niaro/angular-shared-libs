import { kebabCase } from 'lodash-es';

import { lineMicrotask } from '@bp/shared/utils';

import { Describable } from '../../misc';

export class PspPaymentMethodType extends Describable {

	static creditCard = new PspPaymentMethodType('Credit Card');

	static apm = new PspPaymentMethodType('APM');

	static crypto = new PspPaymentMethodType();

	static voucher = new PspPaymentMethodType();

	static isPspBased(type?: PspPaymentMethodType | null) {
		return [
			PspPaymentMethodType.creditCard,
			PspPaymentMethodType.apm,
			PspPaymentMethodType.crypto,
			PspPaymentMethodType.voucher
		].includes(type!);
	}

	logo!: string;

	routeName!: string;

	constructor(displayName?: string, description?: string) {
		super(displayName, description);

		lineMicrotask(() => {
			this.routeName = kebabCase(this.name);
			this.logo = `assets/images/payment-methods/${ this.routeName }`;
		});
	}

}
