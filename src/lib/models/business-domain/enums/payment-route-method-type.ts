import { Enumeration } from '../../misc';

export class PaymentRouteMethodType extends Enumeration {
	static creditCard = new PaymentRouteMethodType('Credit Card');
	static wireTransferManual = new PaymentRouteMethodType('Wire Transfer');
}
