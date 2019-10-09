import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl, NG_VALIDATORS } from '@angular/forms';

import { Validators } from '@bp/shared/validation';

import { FormFieldControlComponent } from '../form-field-control.component';

@Component({
	selector: 'bp-ip-input',
	templateUrl: './ip-input.component.html',
	styleUrls: ['./ip-input.component.scss'],
	host: {
		'(focusout)': 'onTouched()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: IpInputComponent,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: IpInputComponent,
			multi: true
		}
	]
})
export class IpInputComponent extends FormFieldControlComponent<string> {
	internalControl = new FormControl(
		'',
		Validators.pattern(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)
	);

	@Input() placeholder = 'IP';

	get valid() { return this.internalControl.valid; }

	// maskConfig: Partial<TextMaskConfig> = {
	// 	mask: (value: string) => {
	// 		const chars = value.split('');

	// 		const createIpGroup = (charsArr: string[], position: number) => [
	// 			/[0-2]/,
	// 			charsArr[position] === '2' ? /[0-5]/ : /[0-9]/,
	// 			charsArr[position] === '2' ? /[0-5]/ : /[0-9]/
	// 		];

	// 		const ipGroup1 = createIpGroup(chars, 1);
	// 		const ipGroup2 = createIpGroup(chars, 5);
	// 		const ipGroup3 = createIpGroup(chars, 9);
	// 		const ipGroup4 = createIpGroup(chars, 13);

	// 		return [...ipGroup1, '.', ...ipGroup2, '.', ...ipGroup3, '.', ...ipGroup4];
	// 	},
	// 	includeMaskInValue: true
	// };

	update(ip: string) {
		this.internalControl.valid && super.update(ip);
	}
}
