import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as m from 'moment';

import { DateRange, Enumeration, DateRangeInputValue } from '@bp/shared/models/misc';

import { ControlComponent } from '../control.component';

@Component({
	selector: 'bp-date-range-shortcuts',
	templateUrl: './date-range-shortcuts.component.html',
	styleUrls: ['./date-range-shortcuts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: DateRangeShortcutsComponent,
			multi: true
		}
	]
})
export class DateRangeShortcutsComponent extends ControlComponent<DateRange> implements AfterViewInit {

	dateRangeShortcuts = DateRangeShortcut.list() as DateRangeShortcut[];

	selected!: DateRangeShortcut | undefined;

	constructor(cdr: ChangeDetectorRef) {
		super(cdr);
	}

	ngAfterViewInit() {
		this.select(DateRangeShortcut.month);
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: DateRangeInputValue): void {
		Promise
			.resolve()
			.then(() => this.select(value && this.dateRangeShortcuts.find(v => v.dateRange.isSame(DateRange.parse(value)))
				|| DateRangeShortcut.month
			));
	}
	// #endregion Implementation of the ControlValueAccessor interface

	select(value: DateRangeShortcut) {
		if (value === this.selected)
			return;

		this.selected = value;
		this.updateValueAndEmitChange(value.dateRange);
	}
}

export class DateRangeShortcut extends Enumeration {
	static week = new DateRangeShortcut();
	static month = new DateRangeShortcut();
	static quarter = new DateRangeShortcut();
	// static year = new DateRangeShortcut();

	dateRange!: DateRange;

	constructor() {
		super();

		Promise
			.resolve()
			.then(() => {
				this.dateRange = this.getDateRange()!;
				setInterval(() => this.dateRange = this.getDateRange()!, 24 * 60 * 60 * 1000);
			});
	}

	private getDateRange() {
		const to = m().endOf('day');

		switch (this) {
			case DateRangeShortcut.week:
				return new DateRange({ from: m().utc().startOf('week'), to });
			case DateRangeShortcut.month:
				return new DateRange({ from: m().utc().startOf('month'), to });
			case DateRangeShortcut.quarter:
				return new DateRange({ from: m().utc().startOf('quarter'), to });
			// case DateRangeShortcut.year:
			// 	return new DateRange({ from: m().utc().startOf('year'), to });
		}
	}
}
