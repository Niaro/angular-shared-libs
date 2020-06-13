import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FADE_IN_LIST } from '@bp/shared/animations';
import { FormFieldControlComponent } from '@bp/shared/components/core';
import { Countries, Country, CountryCode } from '@bp/shared/models/countries';
import { lineMicrotask } from '@bp/shared/utilities';
import { isArray, isEmpty } from 'lodash-es';

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

	@Input() placeholder = 'Country or its code';

	@Input() hasWorldwide = false;

	@Input()
	get countries() { return this._countries; }
	set countries(value: Country[] | null) { this._countries = value || Countries.list; }
	private _countries = Countries.list;

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
			this._countries = isArray(this.excluded)
				? Countries.list.filter(it => !this.excluded.includes(it))
				: Countries.list;

		if (countries) {
			this._countries = isEmpty(this._countries) ? Countries.list : this._countries;
			this.filtered = this._countries;
		}

		if (hasWorldwide || excluded || countries) {
			this._countries = this._getCountriesAccordingToHasWorldwideFlag(this._countries);
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

			this._setIncomingValueToInternalControl(this._getInternalControlValue() ?? '');
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

	private _getInternalControlValue() {
		return this.value?.name;
	}

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
		const loweredInput = input?.toLowerCase();
		this.filtered = loweredInput
			? this._countries.filter(
				it => it.lowerCaseName?.includes(loweredInput) || it.lowerCaseCode === loweredInput
			)
			: this._countries;
	}
}
