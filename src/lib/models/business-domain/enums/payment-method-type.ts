import { PspPaymentMethodType } from './psp-payment-method-type';

export class PaymentMethodType extends PspPaymentMethodType {

	static wireTransfer = new PaymentMethodType(undefined, 'A set of bank account requisites per currency');

	static externalLink = new PaymentMethodType(undefined, 'A custom link to any internet resource');

	static cryptoWallet = new PaymentMethodType('Crypto Wallets', 'A set of crypto currency addresses');

	static staticMethods = [
		PaymentMethodType.externalLink,
		PaymentMethodType.wireTransfer,
		PaymentMethodType.cryptoWallet
	];

	static assignable = [
		PaymentMethodType.creditCard,
		PaymentMethodType.apm,
		PaymentMethodType.crypto,
		PaymentMethodType.voucher,
		...PaymentMethodType.staticMethods
	];

	static staticPages = new PaymentMethodType('Pages');

	static staticPagesMethods = [
		PaymentMethodType.wireTransfer,
		PaymentMethodType.cryptoWallet
	];

	static isStatic(type: PaymentMethodType) {
		return PaymentMethodType.staticMethods.includes(type);
	}

}
