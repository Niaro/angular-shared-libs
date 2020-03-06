import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, NgForm, FormGroupDirective } from '@angular/forms';

export class DirtyAndInvalidErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		return !!(control?.invalid && (control?.dirty || form?.submitted));
	}
}
