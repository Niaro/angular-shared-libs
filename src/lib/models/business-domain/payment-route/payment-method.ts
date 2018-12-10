import { MetadataEntity, Mapper } from '../../metadata';
import { PaymentRouteMethodType, CardType } from '../enums';
import { Currency } from '../currency';

export class PaymentMethod extends MetadataEntity {
	id: string;

	pspId: string;

	merchantId: string;

	name: string;

	descriptor: string;

	is3dSecure: boolean;

	@Mapper(PaymentRouteMethodType)
	type: PaymentRouteMethodType;

	@Mapper(CardType)
	brands?: CardType[];

	@Mapper(Currency)
	currencies?: Currency[];
}
