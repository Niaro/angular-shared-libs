import { MetadataEntity } from '../metadata-entity';
import { Property } from './property-metadata.decorator';

export function Hint(hint: string, longHint?: string) {
	return function (model: MetadataEntity, property: string) {
		Property({ hint, longHint })(model, property);
	};
}
