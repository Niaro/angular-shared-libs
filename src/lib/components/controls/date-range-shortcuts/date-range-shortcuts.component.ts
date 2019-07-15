import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
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
export class DateRangeShortcutsComponent extends ControlComponent<DateRange> implements OnInit {

	dateRangeShortcuts = DateRangeShortcut.list() as DateRangeShortcut[];

	selected: DateRangeShortcut;

	constructor(private cdr: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.set(DateRangeShortcut.month);
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: DateRangeInputValue): void {
		Promise
			.resolve()
			.then(() => {
				if (value) {
					this.value = DateRange.parse(value);
					this.selected = this.dateRangeShortcuts.find(v => v.dateRange.isSame(this.value));
				} else
					this.set(DateRangeShortcut.month);

				this.cdr.markForCheck();
			});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	update(v: DateRangeShortcut) {
		if (v !== this.selected)
			this.set(v);
	}

	private set(value: DateRangeShortcut) {
		this.selected = value;
		this.value = value.dateRange;
		this.valueChange.next(value.dateRange);
		this.onChange(value.dateRange);
	}
}

export class DateRangeShortcut extends Enumeration {
	static week = new DateRangeShortcut();
	static month = new DateRangeShortcut();
	static quarter = new DateRangeShortcut();
	// static year = new DateRangeShortcut();

	dateRange: DateRange;

	constructor() {
		super();

		Promise
			.resolve()
			.then(() => {
				this.dateRange = this.getDateRange();
				setInterval(() => this.dateRange = this.getDateRange(), 24 * 60 * 60 * 1000);
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
