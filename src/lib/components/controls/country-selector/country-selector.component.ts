import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Countries, Country, CountryCode } from '@bp/shared/models';
import { AbstractControl, ValidationErrors, ValidatorFn, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { isArray } from 'lodash-es';

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
export class CountrySelectorComponent extends InputBasedComponent<Country> implements OnChanges {
	@Input() excluded: Country[];
	countries = Countries.list;
	filtered = this.countries;

	constructor() {
		super();

		this.inputControl.valueChanges
			.subscribe(it => this.onCountryNameChange(it));
	}

	ngOnChanges({ excluded }: SimpleChanges) {
		if (excluded)
			this.countries = isArray(this.excluded)
				? Countries.list.filter(it => !this.excluded.includes(it))
				: Countries.list;
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: Country | CountryCode): void {
		Promise
			.resolve()
			.then(() => {
				this.value = value instanceof Country ? value : Countries.findByCode(value);
				this.inputControl.setValue(this.value && this.value.name || '', { emitViewToModelChange: false });
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
		this.filtered = loweredCountryName
			? this.countries.filter(it => it.lowerCaseName.includes(loweredCountryName))
			: this.countries;

		const country = input && Countries.find(input);
		if (country !== this.value) {
			this.value = country;
			this.valueChange.emit(country);
			this.onChange(country);
		}
	}
}
