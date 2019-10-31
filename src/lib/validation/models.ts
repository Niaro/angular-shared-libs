export type ValidationErrorTemplateVariables = {
	/**
	 * Value for the template string which is either predefined one or defined in the error property
	 */
	required: string | number;

	/**
	 * Value for the template string which is either predefined one or defined in the error property
	 */
	actual?: string | number;
};

export type ValidationError = ValidationErrorTemplateVariables
	| string // text to use custom text
	| true; // true means to use predefined error

export interface IValidationErrors {
	[validator: string]: ValidationError;
}
