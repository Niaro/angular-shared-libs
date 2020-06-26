import m from 'moment';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SLIDE_RIGHT } from '@bp/shared/animations';
import { ControlComponent, DatepickerCalendarHeaderComponent } from '@bp/shared/components/core';
import { lineMicrotask } from '@bp/shared/utilities';

@Component({
	selector: 'bp-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: [ './datepicker.component.scss' ],
	animations: [ SLIDE_RIGHT ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: DatePickerComponent,
			multi: true
		}
	]
})
export class DatePickerComponent extends ControlComponent<m.Moment | null> {
	// tslint:disable-next-line: naming-convention
	DatepickerCalendarHeaderComponent = DatepickerCalendarHeaderComponent;

	@Input() label!: string;

	constructor(cdr: ChangeDetectorRef) {
		super(cdr);
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: m.Moment | null): void {
		lineMicrotask(() => {
			this.value = value;
			this._cdr.markForCheck();
		});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	set(v: m.Moment | null) {
		if (v && this.value && v.isSame(this.value) || v !== this.value)
			this.setValue(v);
	}
}
