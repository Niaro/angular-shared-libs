import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEqual } from 'lodash-es';

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

	constructor(private cdr: ChangeDetectorRef) {
		super();
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

	update(v: DateRangeInput) {
		const value = new DateRange({ ...this.value, ...v });

		if (!isEqual(value, this.value)) {
			this.value = value;
			this.valueChange.next(value);
			this.onChange(value);
		}
	}
}
