import { FieldControlType } from '../enums';
import { MetadataEntity } from '../metadata-entity';
import { PropertyMetadataControl } from '../property-metadata-control';

// tslint:disable-next-line: naming-convention
export function Control(configOrControlType: Partial<PropertyMetadataControl> | FieldControlType) {
	return function(model: MetadataEntity, property: string) {
		const propsMd = MetadataEntity
			.getMetadata(model);

		const propMd = propsMd.get(property);
		const currentControlConfig = propMd ? propMd.control : {};
		const partialControlConfig = configOrControlType instanceof FieldControlType
			? { type: configOrControlType }
			: configOrControlType;
		const control = new PropertyMetadataControl({
			...currentControlConfig,
			...partialControlConfig
		});

		propsMd
			.add(property, { control });
	};
}
