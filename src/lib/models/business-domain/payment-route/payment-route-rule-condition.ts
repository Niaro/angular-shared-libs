import { VolumeConditionType, CardConditionType, BlockConditionType, TransactionConditionType } from '../enums';
import { MetadataEntity } from '../../metadata';

export class PaymentRouteRuleCondition extends MetadataEntity {
	type: VolumeConditionType | TransactionConditionType | CardConditionType | BlockConditionType;

	value: string;

	constructor(data: Partial<PaymentRouteRuleCondition>) {
		super(data);
	}
}
