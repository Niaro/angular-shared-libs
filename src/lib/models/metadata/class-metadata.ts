import { PropertyMetadata } from './property-metadata';

type MetadataHost = { metadata: ClassMetadata };

export class ClassMetadata {

	private _propertiesMetadataDictionary: { [ property: string ]: PropertyMetadata } = {};

	private get _prototypeMetadata(): ClassMetadata | undefined {
		return (<MetadataHost> Object.getPrototypeOf(this._metadataHost))?.metadata;
	}

	private _values!: PropertyMetadata[];

	private _keys!: string[];

	constructor(private readonly _metadataHost: MetadataHost) { }

	add(property: string, metadata: Partial<PropertyMetadata>) {
		this._propertiesMetadataDictionary[ property ] = new PropertyMetadata({
			...(this.get(property) || {}),
			...metadata,
			property
		});
	}

	get<T>(propName: NonFunctionPropertyNames<T>): PropertyMetadata | null {
		return this._propertiesMetadataDictionary[ <string> propName ] ?? this._prototypeMetadata?.get(propName);
	}

	has<T>(propName: NonFunctionPropertyNames<T>): boolean {
		return !!(this._propertiesMetadataDictionary[ <string> propName ] ?? this._prototypeMetadata?.has(propName));
	}

	keys(): string[] {
		return this._keys || (this._keys = [
			...Object.keys(this._propertiesMetadataDictionary),
			...(this._prototypeMetadata?.keys() ?? [])
		]);
	}

	values(): PropertyMetadata[] {
		return this._values || (this._values = [
			...Object.values(this._propertiesMetadataDictionary),
			...(this._prototypeMetadata?.values() ?? [])
		]);
	}
}
