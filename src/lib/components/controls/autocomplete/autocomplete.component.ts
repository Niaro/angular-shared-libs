import { Component, ChangeDetectionStrategy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { isEmpty } from 'lodash-es';

import { lineMicrotask } from '@bp/shared/utils';

import { FormFieldControlComponent } from '../form-field-control.component';

@Component({
	selector: 'bp-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'(focusout)': 'onTouched()'
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: AutocompleteComponent,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: AutocompleteComponent,
			multi: true
		}
	]
})
export class AutocompleteComponent extends FormFieldControlComponent<any | null> implements OnChanges {
	@Input() items!: any[];

	lowercasedItems!: { lowered: string, item: any }[];

	throttle = 0;

	filtered!: any[];

	ngOnChanges(changes: SimpleChanges) {
		super.ngOnChanges(changes);

		const { items } = changes;

		if (items) {
			this.lowercasedItems = this.items && this.items.map(v => ({
				lowered: v.toString().toLowerCase(),
				item: v
			}));
			this.filtered = this.items || [];
		}
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: any): void {
		lineMicrotask(() => {
				this.value = value;
				this.internalControl.setValue(this.value && this.value.toString() || '', { emitViewToModelChange: false });
			});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	// #region Implementation of the Validator interface
	protected validator: ValidatorFn | null = ({ value }: AbstractControl): ValidationErrors | null => {
		return !value && this.internalControl.value
			? { 'autocompleteNotFound': true }
			: null;
	}
	// #endregion Implementation of the Validator interface

	onInternalControlValueChange(input: string) {
		if (isEmpty(this.items))
			return;

		const loweredInput = input && input.toString().toLowerCase().trim();
		this.filtered = loweredInput
			? this.lowercasedItems.filter(it => it.lowered.includes(loweredInput)).map(v => v.item)
			: this.items;
		this.cdr.markForCheck();

		const foundLoweredItem = input && this.lowercasedItems.find(v => v.lowered === loweredInput);
		this.setValue(foundLoweredItem && foundLoweredItem.item || null);
	}
}
