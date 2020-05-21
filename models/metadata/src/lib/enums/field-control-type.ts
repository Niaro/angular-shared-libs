import { Enumeration } from '@bp/shared/models/core';

export class FieldControlType extends Enumeration {
	// general
	static input = new FieldControlType();

	static number = new FieldControlType();

	static email = new FieldControlType();

	static textarea = new FieldControlType();

	static switch = new FieldControlType();

	static datetime = new FieldControlType();

	static date = new FieldControlType();

	static time = new FieldControlType();

	static select = new FieldControlType();

	static autocomplete = new FieldControlType();

	static buttonToggle = new FieldControlType();

	static chip = new FieldControlType();

	// special
	static currency = new FieldControlType();

	static country = new FieldControlType();
}
