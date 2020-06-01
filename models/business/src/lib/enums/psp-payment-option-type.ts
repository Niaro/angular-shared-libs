import { Describable } from '@bp/shared/models/core';
import { lineMicrotask } from '@bp/shared/utilities';
import { kebabCase } from 'lodash-es';

export class PspPaymentOptionType extends Describable {

	static creditCard = new PspPaymentOptionType('Credit Card');

	static apm = new PspPaymentOptionType('APM');

	static crypto = new PspPaymentOptionType();

	static voucher = new PspPaymentOptionType();

	static isPspBased(type?: PspPaymentOptionType | null) {
		return [
			PspPaymentOptionType.creditCard,
			PspPaymentOptionType.apm,
			PspPaymentOptionType.crypto,
			PspPaymentOptionType.voucher
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
