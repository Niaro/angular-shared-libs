import { PropertiesMetadata } from './properties-metadata';
import { NonFunctionPropertyNames } from '../misc/typescript-types';
import { assignWith, isNil, isArray, has, camelCase } from 'lodash-es';
import { Enumeration, isExtensionOf } from '../misc';

export abstract class MetadataEntity {
	static get metadata(): PropertiesMetadata {
		if (has(this, '_metadata'))
			return this._metadata;
		return this._metadata = new PropertiesMetadata();
	}
	private static _metadata = new PropertiesMetadata();

	static getMetaPropertyNames<T>(): NonFunctionPropertyNames<T>[] {
		return this.metadata.list.map(it => it.property) as any;
	}

	static getLabel<T>(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop).label;
	}

	constructor(data: Partial<MetadataEntity>) {
		assignWith(this, data, this.assignCustomizer);
	}

	meta<T = this>(propName: NonFunctionPropertyNames<T>) {
		return (<typeof MetadataEntity>this.constructor).metadata.get(propName);
	}

	getLabel<T = this>(propName: NonFunctionPropertyNames<T>) {
		return this.meta(propName).label;
	}

	protected assignCustomizer = (currValue: any, srcValue: any, key: string, currObject, srcObject) => {
		const mapper = (<typeof MetadataEntity>this.constructor).metadata.mappers[key];
		if (!isNil(srcValue) && mapper) {
			const make = v => isExtensionOf(mapper, Enumeration)
				? (<typeof Enumeration>mapper).parse(camelCase(v))
				// if the mapper doesn't have a name we assume that this is a class is used as a mapper so we initiate it
				: isExtensionOf(mapper, MetadataEntity) ? new mapper(v) : mapper(v, srcObject, currObject);

			return isArray(srcValue)
				? srcValue.map(v => make(v))
				: make(srcValue);
		}
		return srcValue;
	}
}
