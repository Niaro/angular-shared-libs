import { isEmpty } from 'lodash-es';

import { ChangeDetectionStrategy, Component, ContentChild, Directive, HostBinding, Input, ViewChild } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { FormFieldControlComponent } from '@bp/shared/components/core';
import { InputTextMaskConfig, NumberMaskConfig, TextMaskDirective } from '@bp/shared/directives';

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

/**
 * Allows the user to add prefix.
 */
@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'bp-input-prefix, [bpInputPrefix]'
})
export class InputPrefixDirective { }

// tslint:disable-next-line: max-classes-per-file
@Component({
	selector: 'bp-input',
	templateUrl: './input.component.html',
	styleUrls: [ './input.component.scss' ],
	host: {
		'(focusin)': 'onTouched(); tryOpenAutocompletePanel()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: InputComponent,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: InputComponent,
			multi: true
		}
	]
})
export class InputComponent extends FormFieldControlComponent<string | number> {

	@Input() textarea!: boolean;

	@Input() number!: boolean;

	@Input() mask!: InputTextMaskConfig;

	@Input() autocomplete!: MatAutocomplete;

	@Input() hasSearchIcon?: boolean;

	@Input()
	@HostBinding('class.pending')
	pending?: boolean | null;

	@ViewChild(MatAutocompleteTrigger) autocompleteTrigger?: MatAutocompleteTrigger;

	@ViewChild(TextMaskDirective) maskDirective?: TextMaskDirective;

	/** User-supplied override of the label element. */
	@ContentChild(InputLabelDirective) customLabel?: InputLabelDirective;

	@ContentChild(InputHintDirective) customHint?: InputHintDirective;

	@ContentChild(InputPrefixDirective) prefix?: InputPrefixDirective;

	numberMask = new NumberMaskConfig({
		placeholderChar: '\u2000', // whitespace
		allowDecimal: true,
		decimalLimit: 2,
		guide: false,
		maskOnFocus: true
	});

	/**
	 * If the autocomplete is present, the value of the internal control could
	 * be as string as an item of the autocomplete list which is any
	 */
	protected _onInternalControlValueChange(value: string | any) {
		this.setValue(this.maskDirective
			&& this.maskDirective.config instanceof NumberMaskConfig
			&& !this.maskDirective.config.allowLeadingZeroes
			&& !isEmpty(value)
			? +(value!)
			: value
		);
	}

	tryOpenAutocompletePanel() {
		this.autocompleteTrigger?.openPanel();
	}
}
