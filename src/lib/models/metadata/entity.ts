import * as m from 'moment';

import { MetadataEntity } from './metadata-entity';
import { Property } from './decorators/property-metadata.decorator';
import { unixMomentMapper } from './mappers';
import { FieldViewType } from './enums';
import { Mapper } from './decorators/mapper.decorator';
import { View } from './decorators/property-metadata-view.decorator';

export abstract class Entity extends MetadataEntity {
	@Property()
	id!: string | null;

	@Property()
	name!: string | null;

	@Property({
		label: 'Author'
	})
	authorUid!: string | null;

	@Mapper(unixMomentMapper)
	@View(FieldViewType.moment, () => 'LLL')
	createdAt!: m.Moment | null;

	@Mapper(unixMomentMapper)
	@View(FieldViewType.moment, () => 'LLL')
	updatedAt!: m.Moment | null;
}
