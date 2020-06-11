import { assign } from 'lodash-es';
import { Constructor } from './constructor';
import { QueryParamsBase } from './query-params-base';
import { DateRange } from '../../misc/date-range';

export interface IDaterangeQueryParams {
	from: number;
	to: number;
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

		constructor(...args: any[]) {
			super(...args);

			if (this.routeParams.from)
				this.from = +this.routeParams.from;

			if (this.routeParams.to)
				this.to = +this.routeParams.to;

			const dateRange = this.routeParams.range || this.routeParams.period || this.routeParams.dateRange;
			if (dateRange)
				assign(this, DateRange.parse(dateRange).unix());
		}
	};
}
