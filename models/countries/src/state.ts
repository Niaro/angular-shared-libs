import { MapIncomingValue, MetadataEntity } from '@bp/shared/models/metadata';

export class State extends MetadataEntity {

	@MapIncomingValue()
	code!: string;

	@MapIncomingValue()
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
