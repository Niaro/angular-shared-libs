import { MetadataEntity, Mapper } from '../../metadata';
import { Country, Countries } from '../countries';
import { PaymentRouteStatus } from '../enums';
import { Psp } from './psp';
import { PaymentRouteRule } from './payment-route-rule';

export class PaymentRoute extends MetadataEntity {
	id: number;

	@Mapper(v => v instanceof Country ? v : Countries.findByCode(v))
	country: Country;

	@Mapper(PaymentRouteStatus)
	status: PaymentRouteStatus;

	@Mapper(Psp)
	psps: Psp[];

	@Mapper(PaymentRouteRule)
	rules: PaymentRouteRule[];

	constructor(data: Partial<PaymentRoute>) {
		super(data);

		for (const psp of this.psps)
			psp.rules = this.rules.filter(it => it.pspName === psp.name);
	}
}
