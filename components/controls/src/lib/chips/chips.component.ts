import { get, isEmpty, isString, uniq } from 'lodash-es';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CdkPortal } from '@angular/cdk/portal';
import {
	ChangeDetectionStrategy, Component, ContentChild, ElementRef, Input, OnChanges, SimpleChanges,
	ViewChild
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import { FADE } from '@bp/shared/animations';
import { FormFieldControlComponent } from '@bp/shared/components/core';
import { IDescribable } from '@bp/shared/models/core';
import { lineMicrotask } from '@bp/shared/utilities';

export interface IChipControlItem extends IDescribable {
	[ prop: string ]: any;
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

	@ContentChild(CdkPortal) portal?: CdkPortal;

	get $input(): HTMLInputElement { return this.inputRef.nativeElement; }

	separatorKeysCodes: number[] = [ ENTER, COMMA ];

	lowercasedItems!: { lowered: string; item: IChipControlItem; }[];

	throttle = 0;

	filtered!: IChipControlItem[];

	ngOnChanges(changes: SimpleChanges) {
		super.ngOnChanges(changes);

		// tslint:disable-next-line: early-exit
		if (changes.items) {
			this.items = this.items ?? [];

			this.lowercasedItems = this.items.map(item => ({
				item,
				lowered: this.getDisplayName(item)
					.toLowerCase(),
			}));

			this.filtered = this.items;
		}
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: IChipControlItem[] | null): void {
		lineMicrotask(() => {
			this._setIncomingValue(value);
			this._updateFilteredAccordingSelected();
		});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	protected _validator: ValidatorFn | null = (): ValidationErrors | null => {
		return null;
	};

	getDisplayName(v: Object) {
		return get(v, 'displayName') || get(v, 'name') || v.toString();
	}

	protected _onInternalControlValueChange(input: string) {
		if (isEmpty(this.items) || !isString(input))
			return;

		const loweredInput = input && input.toString()
			.toLowerCase()
			.trim();
		this.filtered = loweredInput
			? this.lowercasedItems
				.filter(it => it.lowered.includes(loweredInput))
				.map(v => v.item)
			: this.items;

		this.filtered = this.filtered.filter(v => !this
			._getCurrentArrayValue()
			.includes(v)
		);
		this._cdr.markForCheck();
	}

	add({ value }: MatChipInputEvent): void {
		if (!value)
			return;

		const foundChips = value.split(/,|\s/)
			.map(v => v
				.trim()
				.toLowerCase()
			)
			.filter(v => !!v)
			.map(v => this.lowercasedItems.find(it => it.lowered.includes(v)))
			.filter(v => !!v)
			.map(v => v!.item)
			.filter(v => !this
				._getCurrentArrayValue()
				.includes(v)
			);

		this.select(...foundChips);

		this._resetInput();
	}

	remove(item: IChipControlItem): void {
		this.setValue(this
			._getCurrentArrayValue()
			.filter(v => v !== item)
		);
		this._updateFilteredAccordingSelected();
	}

	selected({ option: { value } }: MatAutocompleteSelectedEvent): void {
		this.select(value);
	}

	select(...value: IChipControlItem[]) {
		this.setValue(uniq([ ...this._getCurrentArrayValue(), ...value ]));
		this._updateFilteredAccordingSelected();
	}

	setValue(value: IChipControlItem[] | null, options?: { emitChange: boolean; }) {
		this._resetInput();
		super.setValue(isEmpty(value) ? null : value, options);
	}

	private _resetInput() {
		this.$input.value = '';
		this.internalControl.setValue(null, { emitEvent: false });
	}

	private _getCurrentArrayValue() {
		return this.value || [];
	}

	private _updateFilteredAccordingSelected() {
		this.filtered = this.items.filter(v => this.value && !this.value.includes(v));
	}
}
