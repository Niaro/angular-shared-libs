import { Enumeration } from '../../misc';

export class PaymentRouteMethodType extends Enumeration {
	static creditCard = new PaymentRouteMethodType('Credit Card');
	static voucher = new PaymentRouteMethodType();
	static wireTransfer = new PaymentRouteMethodType('Wire Transfer');
	static crypto = new PaymentRouteMethodType();
	static ewallet = new PaymentRouteMethodType('EWallet');
	static apm = new PaymentRouteMethodType('APM');
}
