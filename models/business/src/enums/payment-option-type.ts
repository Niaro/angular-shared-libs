import { PspPaymentOptionType } from './psp-payment-option-type';

export class PaymentOptionType extends PspPaymentOptionType {

	static wireTransfer = new PaymentOptionType('Bank Wire Details', 'A set of bank account requisites per currency');

	static externalLink = new PaymentOptionType(undefined, 'A custom link to any internet resource');

	static cryptoWallet = new PaymentOptionType('Crypto Wallets', 'A set of crypto currency addresses');

	static staticMethods = [
		PaymentOptionType.externalLink,
		PaymentOptionType.wireTransfer,
		PaymentOptionType.cryptoWallet
	];

	static assignable = [
		PaymentOptionType.creditCard,
		PaymentOptionType.apm,
		PaymentOptionType.crypto,
		PaymentOptionType.voucher,
		...PaymentOptionType.staticMethods
	];

	static staticPages = new PaymentOptionType('Pages');

	static staticPagesMethods = [
		PaymentOptionType.wireTransfer,
		PaymentOptionType.cryptoWallet
	];

	static isStatic(type: PaymentOptionType) {
		return PaymentOptionType.staticMethods.includes(type);
	}

}
