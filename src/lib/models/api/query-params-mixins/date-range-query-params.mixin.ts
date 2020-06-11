import { assign } from 'lodash-es';
import { Constructor } from './constructor';
import { QueryParamsBase } from './query-params-base';
import { DateRange } from '../../misc/date-range';
import { DateRangeShortcut } from '../../misc/date-range-shortcut';

export interface IDaterangeQueryParams {

	from: number;

	to: number;

	dateRangePreset?: DateRangeShortcut;

}

export type DaterangeQueryParamsCtor = Constructor<IDaterangeQueryParams>;

export function mixinDaterangeQueryParams<T extends Constructor<QueryParamsBase<{
	dateRange?: string | DateRange,
	range?: string | DateRange,
	period?: string | DateRange,
	from?: string,
	to?: string;
}>>>
	(base: T): DaterangeQueryParamsCtor & T {
	return class extends base {

		from!: number;

		to!: number;

		dateRangePreset?: DateRangeShortcut;

		constructor(...args: any[]) {
			super(...args);

			if (this.routeParams.from)
				this.from = +this.routeParams.from;

			if (this.routeParams.to)
				this.to = +this.routeParams.to;

			const routeParamsDateRange = this.routeParams.range
				|| this.routeParams.period
				|| this.routeParams.dateRange;

			const dateRange = routeParamsDateRange ? DateRange.parse(routeParamsDateRange) : undefined;
			if (dateRange)
				assign(this, dateRange.unix());

			// tslint:disable-next-line: early-exit
			if (dateRange?.fullRange)
				this.dateRangePreset = DateRangeShortcut
					.list<DateRangeShortcut>()
					.find(v => v.dateRange.isSame(dateRange));
		}
	};
}
