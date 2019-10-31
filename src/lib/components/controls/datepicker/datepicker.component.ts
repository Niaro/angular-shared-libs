import * as m from 'moment';
import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SLIDE_RIGHT } from '@bp/shared/animations';
import { DatepickerCalendarHeaderComponent } from '../../misc/datepicker-calendar-header';
import { ControlComponent } from '../control.component';

@Component({
	selector: 'bp-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
	animations: [SLIDE_RIGHT],
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
	DatepickerCalendarHeaderComponent = DatepickerCalendarHeaderComponent;

	@Input() label!: string;

	constructor(cdr: ChangeDetectorRef) {
		super(cdr);
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: m.Moment | null): void {
		Promise
			.resolve()
			.then(() => {
				this.value = value;
				this.cdr.markForCheck();
			});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	set(v: m.Moment | null) {
		if (v && this.value && v.isSame(this.value) || v !== this.value)
			this.update(v);
	}
}
