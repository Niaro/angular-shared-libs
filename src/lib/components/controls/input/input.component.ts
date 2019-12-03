import { Component, Input, ChangeDetectionStrategy, ViewChild, Directive, ContentChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEmpty } from 'lodash-es';

import { STATEFUL_SLIDE_RIGHT } from '@bp/shared/animations';
import { TextMaskConfig, TextMaskDirective, NumberMaskConfig } from '@bp/shared/directives';

import { FormFieldControlComponent } from '../form-field-control.component';

/**
 * Allows the user to customize the label.
 */
@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'bp-input-label'
})
export class InputLabelDirective { }

/**
 * Allows the user to customize the hint.
 */
@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'bp-input-hint'
})
export class InputHintDirective { }

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
	@Input() textarea!: boolean;

	@Input() number!: boolean;

	@Input() mask!: TextMaskConfig;

	@Input() autocomplete!: MatAutocomplete;

	@ViewChild(TextMaskDirective, { static: false }) maskDirective?: TextMaskDirective;

	/** User-supplied override of the label element. */
	@ContentChild(InputLabelDirective, { static: false }) customLabel?: InputLabelDirective;

	@ContentChild(InputHintDirective, { static: false }) customHint?: InputHintDirective;

	numberMask = new NumberMaskConfig({
		placeholderChar: '\u2000', // whitespace
		allowDecimal: true,
		decimalLimit: 2,
		guide: false,
		maskOnFocus: true
	});

	onInternalControlValueChange(value: string) {
		this.setValue(this.maskDirective
			&& this.maskDirective.config instanceof NumberMaskConfig
			&& !this.maskDirective.config.allowLeadingZeroes
			&& !isEmpty(value)
			? +(value!)
			: value
		);
	}
}
