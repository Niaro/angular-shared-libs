import * as m from 'moment';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Optional, ChangeDetectorRef } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendarHeader, MatDatepicker, MatCalendar, MatDatepickerIntl } from '@angular/material/datepicker';


@Component({
	selector: 'bp-datepicker-calendar-header',
	templateUrl: './datepicker-calendar-header.component.html',
	styleUrls: ['./datepicker-calendar-header.component.scss'],
	exportAs: 'matCalendarHeader',
	// tslint:disable-next-line:use-component-view-encapsulation
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerCalendarHeaderComponent extends MatCalendarHeader<m.Moment> {
	private dateAdapter: DateAdapter<m.Moment>;

	constructor(
		@Inject(MatDatepicker) public picker: MatDatepicker<m.Moment>,
		_intl: MatDatepickerIntl,
		@Inject(MatCalendar) calendar: MatCalendar<m.Moment>,
		@Optional() _dateAdapter: DateAdapter<m.Moment>,
		@Optional() @Inject(MAT_DATE_FORMATS) _dateFormats: MatDateFormats,
		changeDetectorRef: ChangeDetectorRef
	) {
		super(_intl, calendar, _dateAdapter, _dateFormats, changeDetectorRef);
		this.dateAdapter = _dateAdapter;
	}

	clear() {
		this.picker.select(null);
		this.picker.close();
	}

	moveToToday(): void {
		this.calendar.activeDate = this.dateAdapter.today();
		this.calendar.focusActiveCell();
	}
}
