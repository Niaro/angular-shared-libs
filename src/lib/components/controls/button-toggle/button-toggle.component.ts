import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { FormFieldControlComponent } from '../form-field-control.component';

@Component({
	selector: 'bp-button-toggle',
	templateUrl: './button-toggle.component.html',
	styleUrls: ['./button-toggle.component.scss'],
	host: {
		'(focusin)': 'onTouched()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: ButtonToggleComponent,
		multi: true
	}]
})
export class ButtonToggleComponent extends FormFieldControlComponent<any> {
	@Input() items!: any[];

	@Input() resetButtonText = 'None';
}
