import { assign } from 'lodash-es';

import { DateRange, DateRangeShortcut } from '@bp/shared/models/core';

import { Constructor } from './constructor';
import { QueryParamsBase } from './query-params-base';

export interface IDaterangeQueryParams {

	from: number;

	to: number;

	dateRangePreset?: DateRangeShortcut;

}

export type DaterangeQueryParamsCtor = Constructor<IDaterangeQueryParams>;

export function mixinDaterangeQueryParams<T extends Constructor<QueryParamsBase<{
	dateRange?: string | DateRange;
	range?: string | DateRange;
	period?: string | DateRange;
	from?: string;
	to?: string;
}>>>
	(base: T): DaterangeQueryParamsCtor & T {
	return class extends base {

		from!: number;

		to!: number;

		dateRangePreset?: DateRangeShortcut;

		constructor(...args: any[]) {
			super(...args);

			if (this._routeParams.from)
				this.from = +this._routeParams.from;

			if (this._routeParams.to)
				this.to = +this._routeParams.to;

			const routeParamsDateRange = this._routeParams.range
				|| this._routeParams.period
				|| this._routeParams.dateRange;

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
