import { PropertyMetadata } from './property-metadata';

type MetadataHost = { metadata: ClassMetadata };

export class ClassMetadata {
	private dict: { [property: string]: PropertyMetadata } = { };

	private get protoMetadata(): ClassMetadata | undefined {
		return (<MetadataHost>Object.getPrototypeOf(this.metadataHost))?.metadata;
	}

	private _values!: PropertyMetadata[];

	private _keys!: string[];

	constructor(private readonly metadataHost: MetadataHost) { }

	add(property: string, metadata: Partial<PropertyMetadata>) {
		this.dict[property] = new PropertyMetadata({
			...(this.get(property) || {}),
			...metadata,
			property
		});
	}

	get<T>(propName: NonFunctionPropertyNames<T>): PropertyMetadata | null {
		return this.dict[<string>propName] ?? this.protoMetadata?.get(propName);
	}

	has<T>(propName: NonFunctionPropertyNames<T>): boolean {
		return !!(this.dict[<string>propName] ?? this.protoMetadata?.has(propName));
	}

	keys(): string[] {
		return this._keys || (this._keys = [
			...Object.keys(this.dict),
			...(this.protoMetadata?.keys() ?? [])
		]);
	}

	values(): PropertyMetadata[] {
		return this._values || (this._values = [
			...Object.values(this.dict),
			...(this.protoMetadata?.values() ?? [])
		]);
	}
}
