import m from 'moment';

import { MetadataEntity } from './metadata-entity';
import { unixMomentMapper } from './mappers';
import { FieldViewType } from './enums';
import { Mapper } from './decorators/mapper.decorator';
import { View } from './decorators/view.decorator';
import { Default, Label } from './decorators';

export abstract class Entity extends MetadataEntity {

	@Default(null)
	id!: string | null;

	@Default(null)
	name!: string | null;

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
