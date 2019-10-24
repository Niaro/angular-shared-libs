import { Component, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEmpty } from 'lodash-es';

import { STATEFUL_SLIDE_RIGHT } from '@bp/shared/animations';
import { TextMaskConfig, TextMaskDirective, NumberMaskConfig } from '@bp/shared/directives';

import { FormFieldControlComponent } from '../form-field-control.component';

@Component({
	selector: 'bp-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	animations: [STATEFUL_SLIDE_RIGHT],
	host: {
		'(focusout)': 'onTouched()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: InputComponent,
		multi: true
	}]
})
export class InputComponent extends FormFieldControlComponent<string | number> {
	@Input() textarea!: string;

	@Input() mask!: TextMaskConfig;

	@Input() autocomplete!: MatAutocomplete;

	@ViewChild(TextMaskDirective, { static: false }) maskDirective!: TextMaskDirective;

	onInternalControlValueChange(value: string) {
		this.updateValueAndEmitChange(this.maskDirective
			&& this.maskDirective.config instanceof NumberMaskConfig
			&& !this.maskDirective.config.allowLeadingZeroes
			&& !isEmpty(value)
			? +(value!)
			: value
		);
	}
}
