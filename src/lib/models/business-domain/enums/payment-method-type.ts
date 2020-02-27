import { PspPaymentMethodType } from './psp-payment-method-type';

export class PaymentMethodType extends PspPaymentMethodType {

	static wireTransfer = new PaymentMethodType('Wire Transfer');

	static externalLink = new PaymentMethodType();

	static cryptoWallet = new PaymentMethodType('Crypto Wallets');

	static staticPages = new PaymentMethodType();

	static staticPagesMethods = [
		PaymentMethodType.wireTransfer,
		PaymentMethodType.cryptoWallet
	];

}
