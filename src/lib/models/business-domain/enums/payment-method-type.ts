import { PspPaymentMethodType } from './psp-payment-method-type';

export class PaymentMethodType extends PspPaymentMethodType {

	static wireTransfer = new PaymentMethodType('Wire Transfer');

	static externalLink = new PaymentMethodType();

	static cryptoWallet = new PaymentMethodType('Crypto Wallets');

	static assignable = [
		PaymentMethodType.creditCard,
		PaymentMethodType.apm,
		PaymentMethodType.crypto,
		PaymentMethodType.voucher,
		PaymentMethodType.externalLink,
		PaymentMethodType.cryptoWallet,
		PaymentMethodType.wireTransfer,
	];

	static staticPages = new PaymentMethodType('Pages');

	static staticPagesMethods = [
		PaymentMethodType.wireTransfer,
		PaymentMethodType.cryptoWallet
	];

}
