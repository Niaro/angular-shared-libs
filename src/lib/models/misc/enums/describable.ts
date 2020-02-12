import { Enumeration } from './enum';

export abstract class Describable extends Enumeration {
	constructor(
		displayName?: string | null,
		// tslint:disable-next-line: parameter-properties
		public description?: string
	) {
		super(displayName);
	}
}
