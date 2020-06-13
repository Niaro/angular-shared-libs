import { Type } from '@angular/core';
import { Enumeration } from '@bp/shared/models/core/enum';
import { Dictionary, NonFunctionPropertyNames } from '@bp/shared/typings';
import { isExtensionOf } from '@bp/shared/utilities';
import { camelCase, has, isArray, isNil } from 'lodash-es';
import { ClassMetadata } from './class-metadata';
import { MERGE_JSON_WITH_ENTITY_INSTANCE_TOKEN } from './decorators/merge-json-with-entity-instance.token';
import { PropertyMapper, PropertyMapperFunction, PropertyMetadata } from './property-metadata';



// tslint:disable: no-static-this
export abstract class MetadataEntity {

	private static _metadata: ClassMetadata;

	static get metadata(): ClassMetadata {
		if (has(this, '_metadata'))
			return this._metadata;

		return this._metadata = new ClassMetadata(this);
	}

	static getMetadata(model: MetadataEntity) {
		if (!(model instanceof MetadataEntity))
			throw new Error('The decorator can be set only for the class which extends the MetadataEntity class');

		return (<typeof MetadataEntity> model.constructor).metadata;
	}

	static getMetaPropertyNames<T>(): NonFunctionPropertyNames<T>[] {
		return <any> this.metadata.keys();
	}

	static getLabel<T>(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop)?.label;
	}

	constructor(incomingInstanceData?: any) {
		this._setPropertyAttributes();
		if (incomingInstanceData)
			this._invokePropertyMappers(this._tryMergeJsonIntoInstanceData(incomingInstanceData));
		this._setDefaultPropertyValues();
	}

	getMetadata() {
		return MetadataEntity.getMetadata(this);
	}

	getLabel<T = this>(propName: NonFunctionPropertyNames<T>) {
		return this.getMetadata().get(propName)?.label;
	}

	private _tryMergeJsonIntoInstanceData(instanceData: Dictionary<any>) {
		const jsonPropertiesMetadata = this.getMetadata()
			.values()
			.filter(v => v.mapper === MERGE_JSON_WITH_ENTITY_INSTANCE_TOKEN);

		const parsedJson = jsonPropertiesMetadata.reduce(
			(parsed, metadata) => ({
				...parsed,
				...(instanceData[ metadata.property ]
					? JSON.parse(<string> instanceData[ metadata.property ])
					: {}
				)
			}),
			{}
		);

		return {
			...instanceData,
			...parsedJson
		};
	}

	private _invokePropertyMappers(instanceData: Dictionary<any>) {
		this.getMetadata()
			.values()
			.forEach(md => this._isMetadataAndInstanceValueValidForMapping(md, instanceData)
				? this._assignMappedValue(md, instanceData)
				: this._assignInstanceValueAsIs(md, instanceData)
			);
	}

	private _isMetadataAndInstanceValueValidForMapping(
		{ mapper, property }: PropertyMetadata, instanceData: Dictionary<any>
	) {
		return !!mapper && !isNil(instanceData[ property ]);
	}

	private _assignInstanceValueAsIs({ property }: PropertyMetadata, instanceData: Dictionary<any>) {
		if (instanceData.hasOwnProperty(property))
			(<any> this)[ property ] = instanceData[ property ];
	}

	private _assignMappedValue({ mapper, property }: PropertyMetadata, instanceData: Dictionary<any>) {
		const incomingPropertyValue = instanceData[ property ];
		(<any> this)[ property ] = isArray(incomingPropertyValue) && !this._isFunctionMapper(mapper!)
			? incomingPropertyValue.map(v => this._invokeInferredMapper(mapper!, v, instanceData))
			: this._invokeInferredMapper(mapper!, incomingPropertyValue, instanceData);
	}

	private _invokeInferredMapper(mapper: PropertyMapper, v: any, instanceData: Dictionary<any>) {
		if (this._isFunctionMapper(mapper))
			return mapper(v, instanceData, this);

		if (this._isEnumMapper(mapper))
			return mapper.parse(camelCase(v));

		if (this._isMetadataEntityMapper(mapper))
			return new mapper(v);

		throw new Error('Unsupported metadata entity property mapper');
	}

	private _isFunctionMapper(mapper: PropertyMapper): mapper is PropertyMapperFunction {
		return Object.getPrototypeOf(mapper) === Object.getPrototypeOf(Function);
	}

	private _isEnumMapper(mapper: PropertyMapper): mapper is typeof Enumeration {
		return isExtensionOf(mapper, Enumeration);
	}

	private _isMetadataEntityMapper(mapper: PropertyMapper): mapper is Type<MetadataEntity> {
		return isExtensionOf(mapper, MetadataEntity);
	}

	private _setPropertyAttributes() {
		this.getMetadata()
			.values()
			.filter(v => v.unserializable)
			.forEach(v => Object.defineProperty(this, v.property, {
				enumerable: false,
				configurable: true,
				writable: true
			}));
	}

	private _setDefaultPropertyValues() {
		this.getMetadata()
			.values()
			.filter(v => v.defaultPropertyValue !== undefined && isNil((<any> this)[ v.property ]))
			.forEach(v => (<any> this)[ v.property ] = v.defaultPropertyValue);
	}

}
