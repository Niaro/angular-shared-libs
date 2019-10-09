import { Enumeration } from '../enum';

export class PageType extends Enumeration {
	static new = new PageType();

	static edit = new PageType();

	static copy = new PageType();

	static view = new PageType();

	static loadError = new PageType();
}
