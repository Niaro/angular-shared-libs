import {
	Component, AfterContentInit, OnChanges, ContentChildren, QueryList, Input, SimpleChanges,
	ChangeDetectionStrategy, Output
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest, merge, asyncScheduler } from 'rxjs';
import { filter, startWith, shareReplay, map, pairwise, flatMap, switchMap, auditTime, observeOn } from 'rxjs/operators';
import { isEmpty, transform, isNil, difference, fromPairs } from 'lodash-es';

import { UrlHelper } from '@bp/shared/utils';

import { FilterControlDirective } from './filter-control.directive';

export type FilterValue = { [controlName: string]: any };

@Component({
	selector: 'bp-filter',
	template: `<ng-content></ng-content>`,
	styleUrls: ['filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent<T = FilterValue> implements OnChanges, AfterContentInit {
	@Input() except: string[] = [];
	@Input() type: 'query' | 'matrix' = 'matrix';
	@Input() defaults: T = <T>{};

	@Output('value') value$: Observable<T>;

	get value() { return this._value$.value; }
	get empty() { return isEmpty(this.value); }

	@ContentChildren(FilterControlDirective, { descendants: true })
	private controlsQuery: QueryList<FilterControlDirective>;
	private _value$ = new BehaviorSubject<T>(<T>{});
	private defaults$ = new BehaviorSubject<T>(<T>{});
	private defaultsStringed$ = new BehaviorSubject<Stringify<T>>(<Stringify<T>>{});

	constructor(private router: Router, private route: ActivatedRoute) {
		this.value$ = this._value$.pipe(filter(v => v !== undefined));
	}

	ngOnChanges({ defaults }: SimpleChanges) {
		defaults && this.defaults$.next(this.defaults);
	}

	ngAfterContentInit() {
		const filterControls$ = this.controlsQuery
			.changes
			.pipe(
				startWith(this.controlsQuery),
				map((q: QueryList<FilterControlDirective>) => q.toArray()),
				shareReplay(1)
			);

		/**
		 * Update defaultsStringed on the each controls change or the default change
		 */
		combineLatest(
			filterControls$,
			this.defaults$
		)
			.pipe(
				filter(([, defaults]) => !isEmpty(defaults)),
				map(([controls, defaults]) => transform(controls, (acc, c) => acc[c.name] = UrlHelper.toRouteString(defaults[c.name]), {}))
			)
			.subscribe(this.defaultsStringed$);

		/**
		 * Update the filter controls on the route params change
		 */
		combineLatest(
			filterControls$,
			this.type === 'matrix' ? this.route.params : this.route.queryParams,
			this.defaultsStringed$
		)
			.pipe(
				map(([controls, params, defaults]) => controls.map(control => ({
					control,
					routeValue: params[control.name],
					defaultValue: defaults[control.name]
				}))),
				startWith(undefined),
				pairwise(),
				// update only those controls which are needed to be updated
				map(([prevSet, nextSet]) => nextSet.filter(n => {
					const prev = prevSet && prevSet.find(p => n.control.name === p.control.name);
					return !prev || n.routeValue !== prev.routeValue;
				})),
				flatMap(v => v)
			)
			.subscribe(({ control, routeValue, defaultValue }) => {
				const newControlValue = isNil(routeValue) ? defaultValue : routeValue;
				if (newControlValue !== UrlHelper.toRouteString(control.value))
					control.setValue(UrlHelper.parse(newControlValue));
			});

		/**
		 * Update filter._value$ on the filter controls value change
		 */
		filterControls$
			.pipe(
				switchMap(controls => combineLatest(controls.map(c => c.value$.pipe(
					startWith(c.value),
					map((value): [string, any] => [c.name, value])
				)))),
				auditTime(50),
				map(controlValues => fromPairs(
					controlValues.filter(([, value]) => !isNil(value))
				))
			)
			.subscribe(controlSelectedValues => this._value$.next(<T>controlSelectedValues));

		/**
		 * Update the url on the filter controls value change
		 */
		filterControls$
			.pipe(
				switchMap(controls => merge(...controls.map(c => c.value$.pipe(
					auditTime(50),
					map((value): [string, any] => [c.name, value]),

					// if more than one the filter control emits a value during the same event loop,
					// the router will navigate only to the last fired one, but we need to proceed all of them.
					// Thus in order to update the url for the each value of the each changed filter control
					// we schedule it at the end of the current event loop
					observeOn(asyncScheduler)
				)))),
				map(([controlName, value]): [Params, string, string] => [
					this.type === 'matrix' ? UrlHelper.getRouteParams(this.route) : UrlHelper.getQueryParams(this.route),
					controlName,
					UrlHelper.toRouteString(value)
				]),
				filter(([routeParams, controlName, newRouteValue]) => newRouteValue !== routeParams[controlName])
			)
			.subscribe(([routeParams, controlName, newRouteValue]) => {
				this.except.forEach(v => delete routeParams[v]);

				if (isNil(newRouteValue) || newRouteValue === this.defaultsStringed$.value[controlName])
					delete routeParams[controlName];
				else
					routeParams[controlName] = newRouteValue;

				this.updateUrl(routeParams);
			});

		/**
		 * Remove from the url the deleted filter control
		 */
		filterControls$
			.pipe(
				pairwise(),
				map(([prev, curr]) => difference(prev, curr)),
				filter(v => v.length > 0)
			)
			.subscribe(deleted => {
				const routeParams = this.type === 'matrix' ? UrlHelper.getRouteParams(this.route) : UrlHelper.getQueryParams(this.route);
				deleted.forEach(v => delete routeParams[v.name]);
				this.updateUrl(routeParams);
			});
	}

	private updateUrl(routeParams: Object) {
		if (this.type === 'matrix')
			this.router.navigate([routeParams], { relativeTo: this.route });
		else
			this.router.navigate([], { queryParams: routeParams, relativeTo: this.route });
	}
}
