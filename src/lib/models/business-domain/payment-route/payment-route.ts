import { MetadataEntity, Mapper } from '../../metadata';
import { Country, Countries } from '../countries';
import { PaymentRouteStatus } from '../enums';
import { Psp } from './psp';

export class PaymentRoute extends MetadataEntity {
	id: number;

	@Mapper(v => v instanceof Country ? v : Countries.findByCode(v))
	country: Country;

	@Mapper(PaymentRouteStatus)
	status: PaymentRouteStatus;

	@Mapper(Psp)
	psps: Psp[];

}
