import { Directive, Input, Self, Inject, Optional } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { UrlHelper } from '@bp/shared/utils';
import { BpSelectComponent } from '@bp/shared/features';

@Directive({
	selector: '[bpFilterControl]',
	exportAs: 'filterControl'
})
export class FilterControlDirective {
	@Input('bpFilterControl') name!: string;

	value$ = new OptionalBehaviorSubject<any>();
	get value() { return this.value$.value; }

	get select() { return this.matSelect || this.bpSelect; }

	get control(): ControlValueAccessor { return this.controlValueAccessor && this.controlValueAccessor[0] || this.select; }

	constructor(
		@Optional() @Inject(NG_VALUE_ACCESSOR) @Self() private controlValueAccessor: ControlValueAccessor[],
		@Optional() @Self() private matSelect: MatSelect,
		@Optional() @Self() private bpSelect: BpSelectComponent,
	) {
		if (!this.control)
			throw new Error('FilterControlDirective must be used on a component which implements ControlValuesAccessor interface');

		if (this.select)
			this.select.selectionChange
				.subscribe((v?: MatSelectChange) => this.emit(v && v.value));
		else
			this.control.registerOnChange((v: any) => this.emit(v));
	}

	setValue(value: any) {
		this.value$.next(value);
		if (this.select)
			this.select.value = value;
		else
			this.control.writeValue(value);
	}

	private emit(value?: any) {
		value = value && value.valueOf();
		if ((value && UrlHelper.toRouteString(value)) !== (this.value && UrlHelper.toRouteString(this.value.valueOf())))
			this.value$.next(value);
	}
}
