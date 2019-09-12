import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Countries, Country, CountryCode } from '@bp/shared/models';
import { AbstractControl, ValidationErrors, ValidatorFn, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
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
export class CountrySelectorComponent extends InputBasedComponent<Country | null> implements OnChanges {
	@Input() formControl!: FormControl;

	@Input() excluded!: Country[];

	@Input() placeholder = 'Country';

	@Input() hasWorldwide = false;

	@Input() countries = Countries.list;

	filtered = Countries.list;

	constructor() {
		super();

		this.inputControl.valueChanges
			.subscribe(it => this.onCountryNameChange(it));
	}

	ngOnChanges({ excluded, hasWorldwide, countries, value }: SimpleChanges) {
		if (excluded)
			this.countries = isArray(this.excluded)
				? Countries.list.filter(it => !this.excluded.includes(it))
				: Countries.list;

		if (countries && this.countries)
			this.filtered = this.countries;

		if (hasWorldwide || excluded || countries) {
			this.countries = this.updateWorldwideInCountriesList(this.countries);
			this.filtered = this.updateWorldwideInCountriesList(this.filtered);
		}

		if (value) {
			const countryName = !this.value || !this.hasWorldwide && this.value === Countries.worldwide
				? ''
				: this.value.name;

			this.updateFilteredCountries(countryName);
			this.inputControl.setValue(countryName, { emitEvent: false });
		}
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: Country | CountryCode | null): void {
		Promise
			.resolve()
			.then(() => {
				value = value instanceof Country
					? value
					: value && Countries.findByCode(value);
				this.inputControl.setValue(value && value.name || '', { emitViewToModelChange: false });
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
		this.updateFilteredCountries(input);

		const country = input ? Countries.find(input) : null;
		if (country !== this.value) {
			this.value = country;
			this.valueChange.next(country);
			this.onChange(country);
		}
	}

	private updateWorldwideInCountriesList(list: Country[]) {
		return this.hasWorldwide
			? [Countries.worldwide, ...list]
			: list.filter(v => v !== Countries.worldwide);
	}

	private updateFilteredCountries(input: string) {
		const loweredCountryName = input && input.toLowerCase();
		this.filtered = loweredCountryName
			? this.countries.filter(it => it.lowerCaseName && it.lowerCaseName.includes(loweredCountryName))
			: this.countries;
	}
}
