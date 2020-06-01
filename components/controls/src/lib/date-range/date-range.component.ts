import { Component, HostBinding, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNil } from 'lodash-es';
import m from 'moment';

import { SLIDE_RIGHT } from '@bp/shared/animations';
import { lineMicrotask } from '@bp/shared/utilities';
import { DateRange, DateRangeInput, DateRangeInputValue } from '@bp/shared/models/core';
import { DatepickerCalendarHeaderComponent, ControlComponent } from '@bp/shared/components/core';

@Component({
	selector: 'bp-date-range',
	templateUrl: './date-range.component.html',
	styleUrls: [ './date-range.component.scss' ],
	animations: [ SLIDE_RIGHT ],
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

	@Input() noFutureDates = true;

	@Input() panelClass!: string;

	// tslint:disable-next-line: naming-convention
	DatepickerCalendarHeaderComponent = DatepickerCalendarHeaderComponent;

	@HostBinding('class.empty') get empty() { return this.value.empty; }

	value = new DateRange();

	currentDay = m();

	constructor(cdr: ChangeDetectorRef) {
		super(cdr);
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: DateRangeInputValue): void {
		lineMicrotask(() => {
			this.value = DateRange.parse(value);
			this._cdr.markForCheck();
		});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	patch(v: DateRangeInput | null) {
		if (isNil(v)) {
			this.setValue(new DateRange());
			return;
		}

		if (v.to)
			v.to = m(v.to).endOf('day');

		this.setValue(new DateRange({ ...this.value, ...v }));
	}
}
