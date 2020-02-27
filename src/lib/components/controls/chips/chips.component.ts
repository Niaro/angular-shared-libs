import {
	Component, ChangeDetectionStrategy, OnChanges, Input, SimpleChanges, ViewChild, ElementRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { isEmpty, uniq, get, isString } from 'lodash-es';

import { FADE } from '@bp/shared/animations';
import { lineMicrotask } from '@bp/shared/utils';

import { FormFieldControlComponent } from '../form-field-control.component';

export interface IChipControlItem {
	description?: string;
}

@Component({
	selector: 'bp-chips',
	templateUrl: './chips.component.html',
	styleUrls: [ './chips.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ FADE ],
	host: {
		'(focusin)': 'onTouched()'
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ChipsControlComponent,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: ChipsControlComponent,
			multi: true
		}
	]
})
export class ChipsControlComponent
	extends FormFieldControlComponent<IChipControlItem[] | null>
	implements OnChanges {

	@Input() items!: IChipControlItem[];

	@ViewChild('autocomplete', { static: true }) autocomplete!: MatAutocomplete;

	@ViewChild('input', { static: true }) inputRef!: ElementRef;

	get $input(): HTMLInputElement { return this.inputRef.nativeElement; }

	separatorKeysCodes: number[] = [ ENTER, COMMA ];

	lowercasedItems!: { lowered: string, item: IChipControlItem; }[];

	throttle = 0;

	filtered!: IChipControlItem[];

	ngOnChanges(changes: SimpleChanges) {
		super.ngOnChanges(changes);

		// tslint:disable-next-line: early-exit
		if (changes.items) {
			this.lowercasedItems = this.items && this.items.map(item => ({
				item,
				lowered: this.getDisplayName(item).toLowerCase(),
			}));

			this.filtered = this.items || [];
		}
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: IChipControlItem[] | null): void {
		lineMicrotask(() => {
			this._setIncomingValue(value);
			this._setIncomingValueToInternalControl(value);
			this._updateFilteredAccordingSelected();
		});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	getDisplayName(v: Object) {
		return get(v, 'displayName') || get(v, 'name') || v.toString();
	}

	protected _onInternalControlValueChange(input: string) {
		if (isEmpty(this.items) || !isString(input))
			return;

		const loweredInput = input && input.toString().toLowerCase().trim();
		this.filtered = loweredInput
			? this.lowercasedItems.filter(it => it.lowered.includes(loweredInput)).map(v => v.item)
			: this.items;

		const value = this.value || [];
		this.filtered = this.filtered.filter(v => !value.includes(v));
		this._cdr.markForCheck();
	}

	add({ input, value }: MatChipInputEvent): void {
		if (!value)
			return;

		const foundChips = value.split(/,|\s/)
			.map(v => v.trim().toLowerCase())
			.filter(v => !!v)
			.map(v => this.lowercasedItems.find(it => it.lowered.includes(v)))
			.filter(v => !!v)
			.map(v => v!.item)
			.filter(v => !(this.value || []).includes(v));

		if (foundChips.length)
			this.select(...foundChips);

		// Reset the input value
		if (input)
			input.value = '';
	}

	remove(item: IChipControlItem): void {
		this.setValue((this.value || []).filter(v => v !== item));
		this._updateFilteredAccordingSelected();
	}

	selected({ option: { value } }: MatAutocompleteSelectedEvent): void {
		this.select(value);
		this.$input.value = '';
	}

	select(...value: IChipControlItem[]) {
		this.setValue(uniq([ ...(this.value || []), ...value ]));
		this._updateFilteredAccordingSelected();
	}

	private _updateFilteredAccordingSelected() {
		this.filtered = this.items.filter(v => this.value && !this.value.includes(v));
	}
}
