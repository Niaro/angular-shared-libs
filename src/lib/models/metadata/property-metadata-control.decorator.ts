
import { MetadataEntity } from './metadata-entity';
import { PropertyMetadataControl } from './property-metadata-control';
import { FieldControlType } from './enums';

export function Control(configOrControlType: Partial<PropertyMetadataControl> | FieldControlType) {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, {
				control: new PropertyMetadataControl(configOrControlType instanceof FieldControlType
					? { type: configOrControlType }
					: configOrControlType
				)
			});
	};
}
