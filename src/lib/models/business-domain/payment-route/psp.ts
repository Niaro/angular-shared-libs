import { MetadataEntity, Mapper } from '../../metadata';
import { PaymentRouteStatus, PspStatus } from '../enums';
import { Currency } from '../currency';
import { PaymentMethod } from './payment-method';
import { PaymentRouteRule } from './payment-route-rule';

export class Psp extends MetadataEntity {
	id: string;

	name: string;

	@Mapper(PaymentRouteStatus)
	status: PspStatus;

	cascadeOrder: ICascadeOrder;

	@Mapper(PaymentMethod)
	paymentMethods: PaymentMethod[];

	@Mapper(PaymentRouteRule)
	rules: PaymentRouteRule[];

	@Mapper(v => new Currency(v))
	currencies?: Currency[];
}

export interface ICascadeOrder {
	index: number;

	indexAi: number;
}
