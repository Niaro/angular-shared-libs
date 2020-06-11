import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Input, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateRange, DateRangeInputValue, DateRangeShortcut } from '@bp/shared/models/misc';
import { lineMicrotask } from '@bp/shared/utils';

import { ControlComponent } from '../control.component';

@Component({
	selector: 'bp-date-range-shortcuts',
	templateUrl: './date-range-shortcuts.component.html',
	styleUrls: [ './date-range-shortcuts.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: DateRangeShortcutsComponent,
			multi: true
		}
	]
})
export class DateRangeShortcutsComponent extends ControlComponent<DateRange | null> implements AfterViewInit {

	@Input() asSelect!: boolean;

	@Input() includeYear = true;

	@Input() panelClass!: string;

	@Input() default: DateRangeShortcut | null = DateRangeShortcut.month;

	@HostBinding('class.interactive-links') get isInteractiveLinks() { return !this.asSelect; }

	dateRangeShortcuts!: DateRangeShortcut[];

	selected!: DateRangeShortcut | null;

	writtenValue!: DateRangeInputValue | null;

	constructor(cdr: ChangeDetectorRef) {
		super(cdr);
	}

	ngAfterViewInit() {
		this.dateRangeShortcuts = (this.includeYear
			? DateRangeShortcut.list()
			: DateRangeShortcut.list().filter(v => v !== DateRangeShortcut.year)) as DateRangeShortcut[];
		this.cdr.detectChanges();

		/**
		 * In case on init no one is written a value we set the default one
		 */
		setTimeout(() => !this.writtenValue && this.default && this.select(this.default));
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: DateRangeInputValue | null): void {
		lineMicrotask(() => {
			this.writtenValue = value;
			const inputDateRage = value && DateRange.parse(value);

			let shortcut = !inputDateRage || inputDateRage.empty ? this.default : null;
			if (inputDateRage && inputDateRage.fullRange)
				shortcut = this.dateRangeShortcuts.find(v => v.dateRange.isSame(inputDateRage)) || null;

			this.selected = shortcut;
			this.setValue(shortcut && shortcut.dateRange, { emitChange: false });
		});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	select(value: DateRangeShortcut | null) {
		if (value === this.selected)
			return;

		this.selected = value;
		this.setValue(value && value.dateRange);
	}
}
