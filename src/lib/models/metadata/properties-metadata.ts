import { Enumeration } from '../misc';
import { PropertyMetadata } from './property-metadata';

export class PropertiesMetadata {
	readonly list: PropertyMetadata[] = [];
	readonly mappers: { [property: string]: ((v: any, data: any) => any) | Enumeration | InstanceType<any>} = {};
	readonly defaults: { [property: string]: any } = {};
	private dict: { [property: string]: PropertyMetadata } = {};

	push(metadata: PropertyMetadata) {
		if (this.dict[metadata.property])
			return;

		this.list.push(metadata);
		this.dict[metadata.property] = metadata;
	}

	get<T extends keyof any>(propName: T) {
		return this.dict[<string>propName];
	}
}
