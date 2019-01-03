import { Enumeration } from '../../misc';

export class PaymentMethodType extends Enumeration {
	static creditCard = new PaymentMethodType('Credit Card');
	static voucher = new PaymentMethodType();
	static wireTransfer = new PaymentMethodType('Wire Transfer');
	static crypto = new PaymentMethodType();
	static eWallet = new PaymentMethodType('EWallet');
	static apm = new PaymentMethodType('APM');
}
