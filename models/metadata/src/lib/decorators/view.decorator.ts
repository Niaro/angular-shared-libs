
import { MetadataEntity } from '../metadata-entity';
import { FieldViewType } from '../enums';
import { Property } from './property-metadata.decorator';

// tslint:disable-next-line: naming-convention
export function View(viewType: FieldViewType, viewFormatter?: (propValue: any) => any) {
	return function(model: MetadataEntity, property: string) {
		Property({ viewType, viewFormatter })(model, property);
	};
}
