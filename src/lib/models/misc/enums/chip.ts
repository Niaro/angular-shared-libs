import { Enumeration } from './enum';

export abstract class Chip extends Enumeration {
	constructor(displayName?: string, public description?: string) {
		super(displayName);
	}
}
