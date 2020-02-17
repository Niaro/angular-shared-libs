
import { Type } from '@angular/core';

import { Enumeration } from '../../misc';
import { MetadataEntity } from '../metadata-entity';
import { Property } from './property-metadata.decorator';

// tslint:disable-next-line: naming-convention
export function Mapper(mapper: ((value: any, data: any, self: any) => any) | Type<Enumeration> | Type<MetadataEntity>) {
	return function(model: MetadataEntity, property: string) {
		Property({ mapper })(model, property);
	};
}
