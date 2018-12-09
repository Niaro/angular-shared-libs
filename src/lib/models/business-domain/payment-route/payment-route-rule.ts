import { MetadataEntity, Mapper } from '../../metadata';
import { PaymentRouteRuleType } from '../enums';
import { keys } from 'lodash-es';

export class PaymentRouteRule extends MetadataEntity {
	pspName: string;

	@Mapper(v => PaymentRouteRuleType.parse(v))
	type: PaymentRouteRuleType;

	conditions: { [key: string]: string | number };

	stringedConditions: string;

	constructor(data: Partial<PaymentRouteRule>) {
		super(data);
		this.stringedConditions = keys(this.conditions).map(k => `${k}: ${this.conditions[k]}`).join(', ');
	}
}
