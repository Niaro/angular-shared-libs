import m from 'moment';

import { Default, Label, Mapper, View } from './decorators';
import { FieldViewType } from './enums';
import { unixMomentMapper } from './mappers';
import { MetadataEntity } from './metadata-entity';

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
