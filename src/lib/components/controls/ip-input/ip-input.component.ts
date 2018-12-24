import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

import { Validators } from '@bp/shared/validation';

import { InputBasedComponent } from '../input-based.component';
import { TextMaskConfig } from '@bp/shared/directives';

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
export class IpInputComponent extends InputBasedComponent<string> {
	inputControl = new FormControl(
		'',
		Validators.pattern(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)
	);

	constructor() {
		super();

		this.inputControl.valueChanges
			.subscribe(it => this.onIpChange(it));
	}

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

	onIpChange(ip: string) {
		if (this.inputControl.valid && this.value !== ip) {
			this.value = this.inputControl.value;
			this.valueChange.emit(this.value);
			this.onChange(this.value);
		}
	}
}
