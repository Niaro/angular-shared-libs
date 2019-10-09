
import { MetadataEntity } from './metadata-entity';
import { FieldViewType } from './enums';

export function View(viewType: FieldViewType) {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, { viewType });
	};
}
