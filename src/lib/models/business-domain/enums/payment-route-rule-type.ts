import { Enumeration } from '../../misc';

export class PaymentRouteRuleType extends Enumeration {
	static volume = new PaymentRouteRuleType();
	static transaction = new PaymentRouteRuleType();
	static card = new PaymentRouteRuleType();
	static block = new PaymentRouteRuleType();
}
