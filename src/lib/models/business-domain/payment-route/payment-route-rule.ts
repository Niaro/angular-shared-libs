import { MetadataEntity, Mapper } from '../../metadata';
import { PaymentRouteRuleType } from '../enums';
import { PaymentRouteRuleCondition } from './payment-route-rule-condition';

export class PaymentRouteRule extends MetadataEntity {
	pspId?: string;

	pspName?: string;

	@Mapper(v => PaymentRouteRuleType.parse(v))
	type: PaymentRouteRuleType;

	@Mapper(({ type, value }: Partial<PaymentRouteRuleCondition>, data, self: PaymentRouteRule) => new PaymentRouteRuleCondition({
		type: self.type.conditions.parse(type),
		value
	}))
	conditions: PaymentRouteRuleCondition[];
}
