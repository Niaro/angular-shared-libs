import { MetadataEntity } from './metadata-entity';

export function Default(value: any) {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, { default: value });
	};
}
