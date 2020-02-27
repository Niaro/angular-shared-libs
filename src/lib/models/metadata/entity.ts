import * as m from 'moment';

import { MetadataEntity } from './metadata-entity';
import { unixMomentMapper } from './mappers';
import { FieldViewType } from './enums';
import { Mapper } from './decorators/mapper.decorator';
import { View } from './decorators/view.decorator';
import { Default, MapIncomingValue, Label } from './decorators';

export abstract class Entity extends MetadataEntity {

	@MapIncomingValue()
	id!: string;

	@MapIncomingValue()
	name!: string;

	@Label('Author')
	@Default(null)
	authorUid!: string | null;

	@Mapper(unixMomentMapper)
	@View(FieldViewType.moment, () => 'LLL')
	@Default(null)
	createdAt!: m.Moment | null;

	@Mapper(unixMomentMapper)
	@View(FieldViewType.moment, () => 'LLL')
	@Default(null)
	updatedAt!: m.Moment | null;

}
