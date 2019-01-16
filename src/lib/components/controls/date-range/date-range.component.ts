import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEqual } from 'lodash-es';

import { SLIDE_RIGHT } from '@bp/shared/animations';
import { ControlComponent } from '../control.component';
import { DateRange } from '../../../models/misc/date-range';

type DateRangeValue = { from: number, to: number };

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
	@HostBinding('class.empty') get empty() { return this.value.empty; }

	value = new DateRange();

	constructor(private cdr: ChangeDetectorRef) {
		super();
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: DateRange | DateRangeValue | string): void {
		Promise
			.resolve()
			.then(() => {
				this.value = value instanceof DateRange ? value : new DateRange(value);
				this.cdr.markForCheck();
			});
	}
	// #endregion Implementation of the ControlValueAccessor interface

	update(v: Partial<DateRange>) {
		const value = new DateRange({ ...this.value, ...v });

		if (!isEqual(value, this.value)) {
			this.value = value;
			this.valueChange.emit(value);
			this.onChange(value);
		}
	}
}
