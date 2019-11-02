import { Enumeration } from './enum';

export abstract class Describable extends Enumeration {
	constructor(displayName?: string | null, public description?: string) {
		super(displayName);
	}
}
