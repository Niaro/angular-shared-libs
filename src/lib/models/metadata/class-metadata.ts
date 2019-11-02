import { PropertyMetadata } from './property-metadata';

type MetadataHost = { metadata: ClassMetadata };

export class ClassMetadata {
	private dict: { [property: string]: PropertyMetadata } = { };

	private get protoMetadata() {
		const proto = <MetadataHost>Object.getPrototypeOf(this.metadataHost);
		return proto && proto.metadata;
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

	get(propName: string): PropertyMetadata | null {
		return this.dict[propName] || this.protoMetadata && this.protoMetadata.get(propName);
	}

	has(propName: string): boolean {
		return !!(this.dict[propName] || this.protoMetadata && this.protoMetadata.has(propName));
	}

	keys(): string[] {
		return this._keys || (this._keys = [
			...Object.keys(this.dict),
			...(this.protoMetadata ? this.protoMetadata.keys() : [])
		]);
	}

	values(): PropertyMetadata[] {
		return this._values || (this._values = [
			...Object.values(this.dict),
			...(this.protoMetadata ? this.protoMetadata.values() : [])
		]);
	}
}
