import m from 'moment';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCalendar, MatCalendarHeader, MatDatepicker, MatDatepickerContent, MatDatepickerIntl } from '@angular/material/datepicker';

@Component({
	selector: 'bp-datepicker-calendar-header',
	templateUrl: './datepicker-calendar-header.component.html',
	styleUrls: [ './datepicker-calendar-header.component.scss' ],
	exportAs: 'matCalendarHeader',
	// tslint:disable-next-line:use-component-view-encapsulation
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerCalendarHeaderComponent extends MatCalendarHeader<m.Moment> {

	// tslint:disable-next-line: naming-convention
	private dateAdapter: DateAdapter<m.Moment>;

	constructor(
		@Inject(MatDatepicker) public picker: MatDatepicker<m.Moment>,
		@Inject(MatDatepickerContent) public pickerContent: MatDatepickerContent<m.Moment>,
		intl: MatDatepickerIntl,
		@Inject(MatCalendar) calendar: MatCalendar<m.Moment>,
		@Optional() dateAdapter: DateAdapter<m.Moment>,
		// TODO: Check on the upcoming versions of material the bug with exporting of the type
		@Optional() @Inject(MAT_DATE_FORMATS) dateFormats: any,
		changeDetectorRef: ChangeDetectorRef
	) {
		super(intl, calendar, dateAdapter, dateFormats, changeDetectorRef);
		this.dateAdapter = dateAdapter;

		// Dirty workaround of the mat pickers inability to set a panel class on
		// the overlay
		// this.picker._popupRef.addPanelClass(this.picker.panelClass);
	}

	clear() {
		this.picker.select(null!);
		this.picker.close();
	}

	moveToToday(): void {
		this.calendar.activeDate = this.dateAdapter.today();
		this.calendar.focusActiveCell();
	}
}
