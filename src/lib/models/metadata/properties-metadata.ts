import { PropertyMetadata } from './property-metadata';
import { NonFunctionPropertyNames } from '../typescript-types';

export class PropertiesMetadata {
	readonly list: PropertyMetadata[] = [];
	private dict: { [property: string]: PropertyMetadata } = {};

	push(metadata: PropertyMetadata) {
		if (this.dict[metadata.property])
			return;

		this.list.push(metadata);
		this.dict[metadata.property] = metadata;
	}

	get<T>(propName: NonFunctionPropertyNames<T>) {
		return this.dict[<string>propName];
	}
}
