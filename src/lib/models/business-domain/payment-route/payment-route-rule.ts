import { MetadataEntity, Mapper } from '../../metadata';
import { PaymentRouteRuleType } from '../enums';
import { keys } from 'lodash-es';

export class PaymentRouteRule extends MetadataEntity {
	@Mapper(PaymentRouteRuleType)
	type: PaymentRouteRuleType;

	conditions: IRuleVolumeConditions;

	stringedConditions: string;

	constructor(data: Partial<PaymentRouteRule>) {
		super(data);
		this.stringedConditions = keys(this.conditions).map(k => `${k}: ${this.conditions[k]}`).join(', ');
	}
}

export interface IRuleVolumeConditions {
	min?: number;

	max?: number;

	is?: number;

	above?: number;
}
