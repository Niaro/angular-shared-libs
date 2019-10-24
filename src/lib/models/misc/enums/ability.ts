import { Enumeration } from './enum';

export class Ability extends Enumeration {
	static enabled = new Ability();

	static disabled = new Ability();
}
