import { MetadataEntity, Mapper } from '../../metadata';
import { PaymentMethodType, PaymentMethodBrand } from '../enums';
import { Currency } from '../currency';

export class PaymentMethod extends MetadataEntity {
	id: string;

	pspId: string;

	merchantId: string;

	name: string;

	descriptor: string;

	is3dSecure: boolean;

	@Mapper(PaymentMethodType)
	type: PaymentMethodType;

	@Mapper(PaymentMethodBrand)
	brands?: PaymentMethodBrand[];

	@Mapper(Currency)
	currencies?: Currency[];
}
