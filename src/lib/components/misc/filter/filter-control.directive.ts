import { Directive, Input, Self, Inject, Optional } from '@angular/core';
import { MatSelect } from '@angular/material';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { UrlHelper } from '@bp/shared/utils';

@Directive({
	selector: '[bpFilterControl]'
})
export class FilterControlDirective {
	@Input('bpFilterControl') name: string;

	value$ = new OptionalBehaviorSubject<any>();
	get value() { return this.value$.value; }

	get control(): ControlValueAccessor { return this.controlValueAccessor && this.controlValueAccessor[0] || this.select; }

	constructor(
		@Optional() @Inject(NG_VALUE_ACCESSOR) @Self() private controlValueAccessor: ControlValueAccessor[],
		@Optional() @Self() private select: MatSelect
	) {
		if (!this.control)
			throw new Error('FilterControlDirective must be used on a component which implements ControlValuesAccessor interface');

		this.control.registerOnChange(value => {
			value = value && value.valueOf();
			if ((value && UrlHelper.toRouteString(value)) !== (this.value && UrlHelper.toRouteString(this.value.valueOf())))
				this.value$.next(value);
		});
	}

	setValue(value: any) {
		this.value$.next(value);
		if (this.select)
			this.select.value = value;
		else
			this.control.writeValue(value);
	}
}
