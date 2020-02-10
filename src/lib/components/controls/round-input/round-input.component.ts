import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SLIDE_RIGHT } from '@bp/shared/animations';

import { InputComponent } from '../input';

@Component({
	selector: 'bp-round-input',
	templateUrl: './round-input.component.html',
	styleUrls: ['./round-input.component.scss'],
	animations: [SLIDE_RIGHT],
	host: {
		'(focusout)': 'onTouched()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: RoundInputComponent,
		multi: true
	}]
})
export class RoundInputComponent extends InputComponent {

	@HostBinding('class.rounded-input') round = true;

	autocompleteOrigin = { elementRef: this.host };

}
