import { FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ControlComponent } from './control.component';

export abstract class InputBasedComponent<T> extends ControlComponent<T> {
	inputControl = new FormControl();

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: T): void {
		Promise
			.resolve()
			.then(() => {
				this.value = value;
				this.inputControl.setValue(value, { emitViewToModelChange: false });
			});
	}

	setDisabledState?(isDisabled: boolean) {
		if (isDisabled)
			this.inputControl.disable();
		else
			this.inputControl.enable();
	}
	// #endregion Implementation of the ControlValueAccessor interface

	protected validator: ValidatorFn | null = ({ value }: AbstractControl): ValidationErrors | null => {
		return this.inputControl.invalid
			? { 'invalid': true }
			: null;
	}
}
