import { Enumeration } from '../../misc/enum';

export class FieldViewType extends Enumeration {
	// general
	static text = new FieldViewType();

	static boolean = new FieldViewType();

	static number = new FieldViewType();

	static moment = new FieldViewType();

	static email = new FieldViewType();

	// special
	static currency = new FieldViewType();

	static country = new FieldViewType();
}
