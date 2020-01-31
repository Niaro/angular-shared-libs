import {
	Component, ChangeDetectionStrategy, OnChanges, Input, SimpleChanges, Output, ElementRef,
	ChangeDetectorRef, Optional, ContentChild, TemplateRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective } from '@angular/forms';
import { isEmpty, isString } from 'lodash-es';

import { lineMicrotask, includes, match } from '@bp/shared/utils';

import { FormFieldControlComponent } from '../form-field-control.component';
import { Subject } from 'rxjs';

@Component({
	selector: 'bp-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'(focusin)': 'onTouched()'
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

	@Input() items?: any[] | null;

	@Input() itemDisplayPropertyName?: string;

	@Input() panelClass?: string;

	@Input() filterListFn?: (item: any, search: string) => boolean;

	@Output('inputChanges') readonly inputChanges$ = new Subject<string>();

	@ContentChild(TemplateRef, { static: false }) optionTpl?: TemplateRef<any>;

	lowercasedItems?: { lowered: string, item: any; }[] | null;

	throttle = 0;

	filtered!: any[] | null;

	constructor(
		host: ElementRef,
		cdr: ChangeDetectorRef,
		@Optional() formGroupDirective?: FormGroupDirective
	) {
		super(host, cdr, formGroupDirective);


		this.internalControl.valueChanges.subscribe(v => this.inputChanges$.next(v));
	}

	ngOnChanges(changes: SimpleChanges) {
		super.ngOnChanges(changes);

		const { items, itemDisplayPropertyName } = changes;

		if (items || itemDisplayPropertyName) {
			this.lowercasedItems = this.items && this.items!.map(v => ({
				lowered: (v[this.itemDisplayPropertyName!] || v)?.toString().toLowerCase(),
				item: v
			}));
			this.filtered = this.items || [];
		}
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: any): void {
		lineMicrotask(() => {
			this.value = value;
			this.internalControl.setValue(this.value && this.value.toString() || '', {
				emitViewToModelChange: false,
				emitEvent: false
			});
		});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	// #region Implementation of the Validator interface
	protected validator: ValidatorFn | null = ({ value }: AbstractControl): ValidationErrors | null => {
		return !value && this.internalControl.value
			? { 'autocompleteNotFound': true }
			: null;
	};
	// #endregion Implementation of the Validator interface

	/**
	 * the value of the internal control could
	 * be as string as an item of the autocomplete list which is any
	 */
	onInternalControlValueChange(value: string | null | any) {
		if (isEmpty(this.items))
			return;

		let found: any;
		if (isString(value)) {
			value = value.toString().trim();
			this.filtered = this.items!.filter(v => this.filterItem(v, value));
			found = this.items!.find(v => match(this.getItemCompareString(v), value));
		} else {
			this.filtered = this.items!;
			found = value;
		}

		this.cdr.markForCheck();
		this.setValue(found || null);
	}

	private filterItem(item: any, search: string) {
		return this.filterListFn
			? this.filterListFn(item, search)
			: includes(this.getItemCompareString(item), search);
	}

	private getItemCompareString(item: any) {
		return (item[this.itemDisplayPropertyName!] || item)?.toString();
	}
}
