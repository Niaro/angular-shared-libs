import { Directive, Inject, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BpSelectChange, BpSelectComponent } from '@bp/shared/features/select';
import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { UrlHelper } from '@bp/shared/utilities';

@Directive({
	selector: '[bpFilterControl]',
	exportAs: 'filterControl'
})
export class FilterControlDirective {
	@Input('bpFilterControl') name!: string;

	value$ = new OptionalBehaviorSubject<any>();
	get value() { return this.value$.value; }

	get control(): ControlValueAccessor {
		return this._controlValueAccessor && this._controlValueAccessor[ 0 ] || this._select;
	}

	constructor(
		@Optional() @Inject(NG_VALUE_ACCESSOR) @Self() private _controlValueAccessor: ControlValueAccessor[],
		@Optional() @Self() private _select: BpSelectComponent,
	) {
		if (!this.control)
			throw new Error('FilterControlDirective must be used on a component \ which implements ControlValuesAccessor interface');

		if (this._select)
			this._select.selectionChange
				.subscribe((v?: BpSelectChange) => this._emit(v && v.value));
		else
			this.control.registerOnChange((v: any) => this._emit(v));
	}

	setValue(value: any) {
		this.value$.next(value);

		if (this._select)
			this._select.value = value;
		else
			this.control.writeValue(value);
	}

	private _emit(value?: any) {
		value = value?.valueOf();
		if ((value && UrlHelper.toRouteString(value)) !== (this.value && UrlHelper.toRouteString(this.value.valueOf())))
			this.value$.next(value);
	}
}
