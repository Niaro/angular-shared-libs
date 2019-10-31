import { Component, HostBinding, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SLIDE_RIGHT } from '@bp/shared/animations';
import { DateRange, DateRangeInput, DateRangeInputValue } from '@bp/shared/models/misc/date-range';
import { DatepickerCalendarHeaderComponent } from '../../misc/datepicker-calendar-header';
import { ControlComponent } from '../control.component';

@Component({
	selector: 'bp-date-range',
	templateUrl: './date-range.component.html',
	styleUrls: ['./date-range.component.scss'],
	animations: [SLIDE_RIGHT],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: DateRangeComponent,
			multi: true
		}
	]
})
export class DateRangeComponent extends ControlComponent<DateRange> {
	@Input() showDeleteSign = true;

	DatepickerCalendarHeaderComponent = DatepickerCalendarHeaderComponent;

	@HostBinding('class.empty') get empty() { return this.value.empty; }

	value = new DateRange();

	constructor(cdr: ChangeDetectorRef) {
		super(cdr);
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: DateRangeInputValue): void {
		Promise
			.resolve()
			.then(() => {
				this.value = DateRange.parse(value);
				this.cdr.markForCheck();
			});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	patch(v: DateRangeInput) {
		if (v.to && this.value.from && this.value.from.isSame(v.to))
			v.to = this.value.from.clone().endOf('day');

		this.update(new DateRange({ ...this.value, ...v }));
	}
}
