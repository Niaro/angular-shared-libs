import { Enumeration } from '../../misc';

export class PaymentRouteRuleType extends Enumeration {
	static volume = new PaymentRouteRuleType(['max', 'min', 'is', 'above'], true);
	static transaction = new PaymentRouteRuleType(['equalTo', 'greaterThan', 'lessThan', 'between'], true);
	static card = new PaymentRouteRuleType(['bin', 'brand', 'level', 'issuer']);
	static block = new PaymentRouteRuleType(['volume', 'transaction', 'bin', 'IP']);

	constructor(public options: string[], public isCurrencyType: boolean = false) {
		super();
	}
}
