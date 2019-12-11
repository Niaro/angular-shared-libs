import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Countries, Country, CountryCode } from '@bp/shared/models';
import { AbstractControl, ValidationErrors, ValidatorFn, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { isArray } from 'lodash-es';

import { lineMicrotask } from '@bp/shared/utils';

import { FormFieldControlComponent } from '../form-field-control.component';


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
export class CountrySelectorComponent extends FormFieldControlComponent<Country | null> implements OnChanges {
	@Input() excluded!: Country[];

	@Input() placeholder = 'Country';

	@Input() hasWorldwide = false;

	@Input() countries = Countries.list;

	@Input() panelClass: string;

	filtered = Countries.list;

	throttle = 0;

	UnitedStatesMinorOutlyingIslands = Countries.findByCode('UM');

	ngOnChanges(changes: SimpleChanges) {
		super.ngOnChanges(changes);

		const { excluded, hasWorldwide, countries, value } = changes;

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
			this.internalControl.setValue(countryName, { emitEvent: false });
		}
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: Country | CountryCode | null): void {
		lineMicrotask(() => {
				this.setValue(
					value instanceof Country
						? value
						: value && Countries.findByCode(value),
				{ emitChange: false });
				this.internalControl.setValue(this.value && this.value.name || '', { emitViewToModelChange: false });
			});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	// #region Implementation of the Validator interface
	protected validator: ValidatorFn | null = ({ value }: AbstractControl): ValidationErrors | null => {
		return !value && this.internalControl.value
			? { 'countryNotFound': true }
			: null;
	}
	// #endregion Implementation of the Validator interface

	onInternalControlValueChange(input: string) {
		this.updateFilteredCountries(input);

		if (this.value && this.value.name === input)
			return;

		this.setValue(input ? Countries.find(input) : null);
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
