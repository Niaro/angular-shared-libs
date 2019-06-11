import * as m from 'moment';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
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
export class DatePickerComponent extends ControlComponent<m.Moment> {
	DatepickerCalendarHeaderComponent = DatepickerCalendarHeaderComponent;
	@Input() label: string;
	@Input() formControlName: string;

	constructor(private cdr: ChangeDetectorRef) {
		super();
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: m.Moment): void {
		Promise
			.resolve()
			.then(() => {
				this.value = value;
				this.cdr.markForCheck();
			});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	update(v: m.Moment | null) {
		if (v && this.value && v.isSame(this.value) || v !== this.value) {
			this.value = v;
			this.valueChange.next(v);
			this.onChange(v);
		}
	}
}
