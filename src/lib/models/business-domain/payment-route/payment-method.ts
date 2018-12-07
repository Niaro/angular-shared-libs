import { MetadataEntity, Mapper } from '../../metadata';
import { PaymentRouteMethodType, CardType } from '../enums';
import { Currency } from '../currency';

export class PaymentMethod extends MetadataEntity {
	@Mapper(PaymentRouteMethodType)
	type: PaymentRouteMethodType;

	@Mapper(CardType)
	brands?: CardType[];

	@Mapper(Currency)
	currencies?: Currency[];
}
