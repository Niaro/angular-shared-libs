import { MetadataEntity, Mapper } from '../../metadata';
import { Country, Countries } from '../countries';
import { PaymentRouteStatus } from '../enums';
import { Psp } from './psp';
import { PaymentRouteRule } from './payment-route-rule';

export class PaymentRoute extends MetadataEntity {
	id: string;

	merchantId: string;

	merchantName: string;

	name: string;

	@Mapper(v => v instanceof Country || v === 'ALL' ? v : Countries.findByCode(v))
	country: Country | 'ALL';

	@Mapper(PaymentRouteStatus)
	status: PaymentRouteStatus;

	@Mapper(Psp)
	psps: Psp[];

	@Mapper(PaymentRouteRule)
	globalPaymentRules?: PaymentRouteRule[];

	@Mapper(PaymentRouteRule)
	paymentRules?: PaymentRouteRule[];

	constructor(data: Partial<PaymentRoute>) {
		super(data);

		if (this.paymentRules) {
			this.globalPaymentRules = [...(this.globalPaymentRules || []), ...this.paymentRules.filter(it => !it.pspName)];
			for (const psp of this.psps)
				psp.rules = this.paymentRules.filter(it => it.pspName === psp.name);
		}
	}
}
