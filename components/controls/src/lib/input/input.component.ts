import {
	Component, Input, ChangeDetectionStrategy, ViewChild, Directive, ContentChild, HostBinding
} from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEmpty } from 'lodash-es';

import { STATEFUL_SLIDE_RIGHT } from '@bp/shared/animations';
import { TextMaskDirective, NumberMaskConfig, InputTextMaskConfig } from '@bp/shared/directives';

import { FormFieldControlComponent } from '@bp/shared/components/core';

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

@Component({
	selector: 'bp-input',
	templateUrl: './input.component.html',
	styleUrls: [ './input.component.scss' ],
	animations: [ STATEFUL_SLIDE_RIGHT ],
	host: {
		'(focusin)': 'onTouched()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ {
		provide: NG_VALUE_ACCESSOR,
		useExisting: InputComponent,
		multi: true
	} ]
})
export class InputComponent extends FormFieldControlComponent<string | number> {

	@Input() textarea!: boolean;

	@Input() number!: boolean;

	@Input() mask!: InputTextMaskConfig;

	@Input() autocomplete!: MatAutocomplete;

	@Input() hasSearchIcon!: boolean;

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
}
