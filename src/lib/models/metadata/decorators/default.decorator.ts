import { MetadataEntity } from '../metadata-entity';
import { Property } from './property-metadata.decorator';

// tslint:disable-next-line: naming-convention
export function Default(value: any) {
	return function (model: MetadataEntity, property: string) {
		Property({ defaultPropertyValue: value })(model, property);
	};
}
