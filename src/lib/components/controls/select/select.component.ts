import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { FormFieldControlComponent } from '../form-field-control.component';

@Component({
	selector: 'bp-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	host: {
		'(focusout)': 'onTouched()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: SelectComponent,
		multi: true
	}]
})
export class SelectComponent extends FormFieldControlComponent<any> {
	@Input() items!: any[];

	@Input() optionClass!: string;

	@Input() resetOptionText = 'None';
}
