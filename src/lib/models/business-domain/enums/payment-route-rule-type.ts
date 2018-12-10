import { Enumeration } from '../../misc';
import { VolumeConditionType, TransactionConditionType, CardConditionType, BlockConditionType } from './payment-route-conditions-types';

export class PaymentRouteRuleType extends Enumeration {
	static volume = new PaymentRouteRuleType(VolumeConditionType, true);
	static transaction = new PaymentRouteRuleType(TransactionConditionType, true);
	static card = new PaymentRouteRuleType(CardConditionType);
	static block = new PaymentRouteRuleType(BlockConditionType);

	constructor(public conditions: typeof Enumeration, public isCurrencyType: boolean = false) {
		super();
	}
}
