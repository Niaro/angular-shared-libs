import { Enumeration } from '../../misc';

export class PaymentRouteMethodType extends Enumeration {
	static creditCard = new PaymentRouteMethodType('Credit Card');
	static voucher = new PaymentRouteMethodType();
	static wireTransfer = new PaymentRouteMethodType('Wire Transfer');
	static bitcoin = new PaymentRouteMethodType();
	static cap = new PaymentRouteMethodType('CAP');
}
