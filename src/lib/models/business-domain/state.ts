import { MetadataEntity } from '../metadata/metadata-entity';

export class State extends MetadataEntity {
	code!: string;
	name!: string;

	constructor(data: Partial<State>) {
		super(data);
		Object.freeze(this);
	}

	toString() {
		return this.name;
	}

	valueOf(): any {
		return this.code;
	}

	toJSON() {
		return this.code;
	}
}
