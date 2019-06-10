export interface IValidationError {
	/**
	 * Value for the template string which is either predefined one or defined in the error property
	 */
	required: string | number;

	/**
	 * Value for the template string which is either predefined one or defined in the error property
	 */
	actual?: string | number;
}

export interface IValidationErrors {
	[validator: string]: IValidationError | true; // true means to use predefined error
}
