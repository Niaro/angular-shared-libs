import { assign } from 'lodash-es';
import { Constructor } from './constructor';
import { QueryParamsBase } from './query-params-base';
import { DateRange } from '../../misc/date-range';

export interface IDaterangeQueryParams {
	from: number;
	to: number;
}

export type DaterangeQueryParamsCtor = Constructor<IDaterangeQueryParams>;

export function mixinDaterangeQueryParams<T extends Constructor<QueryParamsBase<{ dateRange: string }>>>
	(base: T): DaterangeQueryParamsCtor & T {
	return class extends base {
		from!: number;
		to!: number;

		constructor(...args: any[]) {
			super(...args);

			this.routeParams.dateRange && assign(this, DateRange.parseString(this.routeParams.dateRange).unix());
		}
	};
}
