import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Countries, Country } from '@bp/shared/models';
import { AbstractControl, ValidationErrors, ValidatorFn, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { InputBasedComponent } from '../input-based.component';

@Component({
	selector: 'bp-country-selector',
	templateUrl: './country-selector.component.html',
	styleUrls: ['./country-selector.component.scss'],
	host: {
		'(focusout)': 'onTouched()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: CountrySelectorComponent,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: CountrySelectorComponent,
			multi: true
		}
	]
})
export class CountrySelectorComponent extends InputBasedComponent<Country> {
	countries = Countries.list;

	constructor() {
		super();

		this.inputControl.valueChanges
			.subscribe(it => this.onCountryNameChange(it));
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: Country): void {
		Promise
			.resolve()
			.then(() => {
				this.value = value;
				this.inputControl.setValue(value && value.name, { emitViewToModelChange: false });
			});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	// #region Implementation of the Validator interface
	protected validator: ValidatorFn | null = ({ value }: AbstractControl): ValidationErrors | null => {
		return !value && this.inputControl.value
			? { 'countryNotFound': true }
			: null;
	}
	// #endregion Implementation of the Validator interface

	onCountryNameChange(input: string) {
		const loweredCountryName = input && input.toLowerCase();
		this.countries = loweredCountryName
			? Countries.list.filter(it => it.lowerCaseName.includes(loweredCountryName))
			: Countries.list;

		const country = input && Countries.find(input);
		if (country !== this.value) {
			this.value = country;
			this.valueChange.emit(country);
			this.onChange(country);
		}
	}
}
