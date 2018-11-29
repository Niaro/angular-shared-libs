import { PropertiesMetadata } from './properties-metadata';
import { NonFunctionPropertyNames } from '../typescript-types';

export abstract class MetadataEntity {
	static readonly metadata = new PropertiesMetadata();

	static getMetaPropertyNames<T>(): NonFunctionPropertyNames<T>[] {
		return this.metadata.list.map(it => it.property) as any;
	}

	static getLabel<T>(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop).label;
	}

	meta<T = this>(propName: NonFunctionPropertyNames<T>) {
		return (<typeof MetadataEntity>this.constructor).metadata.get(propName);
	}
}
