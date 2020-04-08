import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { isArray, isEmpty } from 'lodash-es';

import { Countries, Country, CountryCode } from '@bp/shared/models';
import { lineMicrotask } from '@bp/shared/utils';
import { FADE_IN_LIST } from '@bp/shared/animations';

import { FormFieldControlComponent } from '../form-field-control.component';

@Component({
	selector: 'bp-country-selector',
	templateUrl: './country-selector.component.html',
	styleUrls: [ './country-selector.component.scss' ],
	host: {
		'(focusin)': 'onTouched()'
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
	],
	animations: [ FADE_IN_LIST ]
})
export class CountrySelectorComponent extends FormFieldControlComponent<Country | null> implements OnChanges {

	@Input() excluded!: Country[];

	@Input() placeholder = 'Country';

	@Input() hasWorldwide = false;

	@Input() countries = Countries.list;

	@Input() panelClass!: string;

	name = 'country';

	filtered = Countries.list;

	throttle = 0;

	unitedStatesMinorOutlyingIslands = Countries.findByCode('UM');

	worldwide = Countries.worldwide;

	ngOnChanges(changes: SimpleChanges) {
		super.ngOnChanges(changes);

		const { excluded, hasWorldwide, countries, value } = changes;

		if (excluded)
			this.countries = isArray(this.excluded)
				? Countries.list.filter(it => !this.excluded.includes(it))
				: Countries.list;

		if (countries) {
			this.countries = isEmpty(this.countries) ? Countries.list : this.countries;
			this.filtered = this.countries;
		}

		if (hasWorldwide || excluded || countries) {
			this.countries = this._getCountriesAccordingToHasWorldwideFlag(this.countries);
			this.filtered = this._getCountriesAccordingToHasWorldwideFlag(this.filtered);
		}

		// tslint:disable-next-line: early-exit
		if (value) {
			const country = !this.value || !this.hasWorldwide && this.value === Countries.worldwide
				? null
				: this.value;

			this._filterCountries(country?.name);
			this.writeValue(country);
		}
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value?: Country | CountryCode | null): void {
		lineMicrotask(() => {
			this._setIncomingValue(value instanceof Country
				? value
				: (value && Countries.findByCode(value)) ?? null
			);
			this._setIncomingValueToInternalControl(this.value?.name ?? '');
		});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	// #region Implementation of the Validator interface
	// tslint:disable-next-line: no-unnecessary-type-annotation
	protected _validator: ValidatorFn | null = ({ value }: AbstractControl): ValidationErrors | null => {
		return !value && this.internalControl.value
			? { 'countryNotFound': true }
			: null;
	};
	// #endregion Implementation of the Validator interface

	protected _onInternalControlValueChange(input: string | null) {
		this._filterCountries(input);

		if (this.value?.name === input)
			return;

		this.setValue(Countries.find(input));
	}

	private _getCountriesAccordingToHasWorldwideFlag(list: Country[]) {
		return this.hasWorldwide
			? [ Countries.worldwide, ...list ]
			: list.filter(v => v !== Countries.worldwide);
	}

	private _filterCountries(input?: string | null) {
		const loweredCountryName = input?.toLowerCase();
		this.filtered = loweredCountryName
			? this.countries.filter(it => it.lowerCaseName?.includes(loweredCountryName))
			: this.countries;
	}
}
