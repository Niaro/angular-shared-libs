import { Component, ChangeDetectionStrategy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { isEmpty } from 'lodash-es';

import { InputBasedComponent } from '../input-based.component';


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
		}
	]
})
export class AutocompleteComponent extends InputBasedComponent<string> implements OnChanges {
	@Input() formControl: FormControl;
	@Input() items: string[];
	@Input() placeholder: string;
	@Input() inputClass = 'rounded-input';

	lowercasedItems: { lowered: string, original: string }[];
	filtered: string[];

	constructor() {
		super();

		this.inputControl.valueChanges
			.subscribe(it => this.onInputChange(it));
	}

	ngOnChanges({ items }: SimpleChanges) {
		if (items) {
			this.lowercasedItems = this.items && this.items.map(v => ({ lowered: v.toLowerCase(), original: v }));
			this.filtered = this.items || [];
		}
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: any): void {
		Promise
			.resolve()
			.then(() => this.inputControl.setValue(value && value.toString() || '', { emitViewToModelChange: false }));
	}
	// #endregion Implementation of the ControlValueAccessor interface

	onInputChange(input: string) {
		if (isEmpty(this.items))
			return;

		const loweredInput = input && input.toLowerCase();
		this.filtered = loweredInput
			? this.lowercasedItems.filter(it => it.lowered.includes(loweredInput)).map(v => v.original)
			: this.items;

		const foundLoweredItem = input && this.lowercasedItems.find(v => v.lowered === loweredInput);
		const found = foundLoweredItem && foundLoweredItem.original;
		if (found !== this.value) {
			this.value = found;
			this.valueChange.next(found);
			this.onChange(found);
		}
	}
}
