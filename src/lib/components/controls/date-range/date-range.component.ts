import * as m from 'moment';
import {
	Component, OnChanges, Input, EventEmitter, Output, SimpleChanges, HostBinding,
	ChangeDetectionStrategy
} from '@angular/core';
import { assign, isNumber } from 'lodash-es';

import { SLIDE_RIGHT } from '@bp/shared/utils';

type DataRangeValue = { from: number | m.Moment, to: number | m.Moment };

@Component({
	selector: 'bp-date-range',
	templateUrl: './date-range.component.html',
	styleUrls: ['./date-range.component.scss'],
	animations: [SLIDE_RIGHT],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeComponent implements OnChanges {
	@Input() value: DataRangeValue;
	@Input() unix: boolean;
	@Output() valueChange = new EventEmitter<DataRangeValue>();
	@HostBinding('class.empty') get empty() { return !this._value.from && !this._value.to; }

	_value = new DateRange();

	constructor() { }

	ngOnChanges({ value, unix }: SimpleChanges) {
		if (value)
			this._value = new DateRange(this.value
				? {
					from: isNumber(this.value.from) ? m.unix(this.value.from) : this.value.from,
					to: isNumber(this.value.to) ? m.unix(this.value.to) : this.value.to,
				}
				: {}
			);

		if (unix)
			this.unix = true;
	}

	update(v: Partial<DateRange>) {
		this._value = new DateRange({ ...this._value, ...v });
		this.valueChange.emit(this.unix
			? this._value && this._value.unix()
			: this._value
		);
	}
}

class DateRange {
	from: m.Moment;
	to: m.Moment;

	constructor(data?: Partial<DateRange>) {
		assign(this, data);
	}

	unix() {
		return {
			from: this.from ? this.from.unix() : this.from,
			to: this.to ? this.to.unix() : this.to
		};
	}
}
