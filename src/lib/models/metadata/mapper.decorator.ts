
import { Type } from '@angular/core';

import { Enumeration } from '../misc';
import { MetadataEntity } from './metadata-entity';

export function Mapper(cb: ((value: any, data: any, self: any) => any) | Type<Enumeration> | Type<MetadataEntity>) {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, { mapper: cb });
	};
}
