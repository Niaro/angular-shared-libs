import { Enumeration } from '../../misc';

export class PaymentMethodType extends Enumeration {
	static creditCard = new PaymentMethodType('Credit Card');
	static crypto = new PaymentMethodType();
	static apm = new PaymentMethodType('APM');
	static voucher = new PaymentMethodType();
	static wireTransfer = new PaymentMethodType('Wire Transfer');
	static eWallet = new PaymentMethodType('EWallet');
	static alipay = new PaymentMethodType();
	static banks = new PaymentMethodType();
}
