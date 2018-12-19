import { Component, ChangeDetectionStrategy, Output, Input, HostBinding, EventEmitter } from '@angular/core';
import { Countries, Country } from '@bp/shared/models';

@Component({
	selector: 'bp-country-selector',
	templateUrl: './country-selector.component.html',
	styleUrls: ['./country-selector.component.scss'],
	host: {
		'(focusout)': 'dirty = true'
	},
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountrySelectorComponent {
	@Input() value: Country;
	@Output() valueChange = new EventEmitter<Country>();

	@HostBinding('class.ng-dirty') dirty = false;
	@HostBinding('class.ng-invalid') get invalid() { return this.inputValue && !this.value; }

	countries = Countries.list;
	inputValue: string;

	onCountryNameChange(input: string) {
		this.inputValue = input;

		const loweredCountryName = input && input.toLowerCase();
		this.countries = loweredCountryName
			? Countries.list.filter(it => it.lowerCaseName.includes(loweredCountryName))
			: Countries.list;

		const country = input && Countries.find(input);
		if (country !== this.value) {
			this.value = country;
			this.valueChange.emit(country);
		}
	}
}
