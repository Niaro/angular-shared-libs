import { Enumeration } from '../../misc';

export class PaymentRouteStatus extends Enumeration {
	static active = new PaymentRouteStatus();
	static disabled = new PaymentRouteStatus();
}
