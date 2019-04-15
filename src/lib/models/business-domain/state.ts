import { MetadataEntity } from '../metadata';

export class State extends MetadataEntity {
	iso: string;
	name: string;

	constructor(data: Partial<State>) {
		super(data);
		Object.freeze(this);
	}

	valueOf(): any {
		return this.iso;
	}

	toJSON() {
		return this.iso;
	}
}
