import { difference, fromPairs, get, isEmpty, isNil, set, transform } from 'lodash-es';
import { asyncScheduler, BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import {
	auditTime, debounceTime, filter, map, mergeMap, observeOn, pairwise, shareReplay, startWith, switchMap,
	tap
} from 'rxjs/operators';

import {
	AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, Input, OnChanges,
	Output, QueryList, SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Stringify } from '@bp/shared/typings';
import { UrlHelper } from '@bp/shared/utilities';

import { FilterControlDirective } from './filter-control.directive';

export type FilterValue = { [ controlName: string ]: any; };

@Component({
	selector: 'bp-filter',
	template: `<ng-content></ng-content>`,
	styleUrls: [ './filter.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent<T = FilterValue> implements OnChanges, AfterContentInit {

	@Input() except: string[] = [];

	@Input() type: 'query' | 'matrix' = 'matrix';

	@Input() defaults: T = <T> {};

	@Output('value') readonly value$: Observable<T>;

	get value() { return this._value$.value; }

	empty!: boolean;

	@ContentChildren(FilterControlDirective, { descendants: true })
	private _controlsQuery!: QueryList<FilterControlDirective>;

	private _value$ = new BehaviorSubject<T>(<T> {});

	private _defaults$ = new BehaviorSubject<T>(<T> {});

	private _defaultsStringed$ = new BehaviorSubject<Stringify<T>>(<Stringify<T>> {});

	constructor(
		private _router: Router,
		private _route: ActivatedRoute
	) {
		this.value$ = this._value$.pipe(
			tap(v => this.empty = isEmpty(v)),
			filter(v => v !== undefined)
		);
	}

	ngOnChanges({ defaults }: SimpleChanges) {
		defaults && this._defaults$.next(this.defaults);
	}

	ngAfterContentInit() {
		const filterControls$ = this._controlsQuery
			.changes
			.pipe(
				startWith(this._controlsQuery),
				map((q: QueryList<FilterControlDirective>) => q.toArray()),
				shareReplay({ refCount: false, bufferSize: 1 })
			);

		/**
		 * Update defaultsStringed on the each controls change or the default change
		 */
		combineLatest([
			filterControls$,
			this._defaults$
		])
			.pipe(
				filter(([ , defaults ]) => !isEmpty(defaults)),
				map(([ controls, defaults ]) => transform(
					controls,
					(acc, c) => set(acc, c.name, UrlHelper.toRouteString(get(defaults, c.name))),
					<Stringify<T>> {}
				))
			)
			.subscribe(this._defaultsStringed$);

		/**
		 * Update the filter controls on the route params change
		 */
		combineLatest([
			filterControls$,
			this.type === 'matrix' ? this._route.params : this._route.queryParams,
			this._defaultsStringed$
		])
			.pipe(
				map(([ controls, params, defaults ]) => controls.map(c => ({
					control: c,
					routeValue: params[ c.name ],
					defaultValue: get(defaults, c.name)
				}))),
				startWith(undefined),
				pairwise(),
				// update only those controls which are needed to be updated
				map(([ prevSet, nextSet ]) => nextSet!.filter(n => {
					const prev = prevSet && prevSet.find(p => n.control.name === p.control.name);

					return !prev || n.routeValue !== prev.routeValue;
				})),
				mergeMap(v => v)
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
					map((value): [ string, any ] => [ c.name, value ])
				)))),
				auditTime(50),
				map(controlValues => fromPairs(
					controlValues.filter(([ , value ]) => !isNil(value))
				))
			)
			.subscribe(controlSelectedValues => this._value$.next(<T> controlSelectedValues));

		/**
		 * Update the url on the filter controls value change
		 */
		filterControls$
			.pipe(
				switchMap(controls => merge(...controls.map(c => c.value$.pipe(
					debounceTime(50),
					map((value): [ string, any ] => [ c.name, value ]),

					// if more than one the filter control emits a value during the same event loop,
					// the router will navigate only to the last fired one, but we need to proceed all of them.
					// Thus in order to update the url for the each value of the each changed filter control
					// we schedule it at the end of the current event loop
					observeOn(asyncScheduler)
				)))),
				map(([ controlName, value ]): [ Params, string, string | undefined ] => [
					this.type === 'matrix'
						? UrlHelper.getLastPrimaryRouteNonNilParams(this._route)
						: UrlHelper.getLastPrimaryRouteQueryParams(this._route),
					controlName,
					UrlHelper.toRouteString(value)
				]),
				filter(([ routeParams, controlName, newRouteValue ]) => newRouteValue !== routeParams[ controlName ])
			)
			.subscribe(([ routeParams, controlName, newRouteValue ]) => {
				this.except.forEach(v => delete routeParams[ v ]);

				if (isNil(newRouteValue) || newRouteValue === get(this._defaultsStringed$.value, controlName))
					delete routeParams[ controlName ];
				else
					routeParams[ controlName ] = newRouteValue;

				this._updateUrl(routeParams);
			});

		/**
		 * Remove from the url the deleted filter control
		 */
		filterControls$
			.pipe(
				pairwise(),
				map(([ prev, curr ]) => difference(prev, curr)),
				filter(v => v.length > 0)
			)
			.subscribe(deleted => {
				const routeParams = this.type === 'matrix'
					? UrlHelper.getLastPrimaryRouteNonNilParams(this._route)
					: UrlHelper.getLastPrimaryRouteQueryParams(this._route);
				deleted.forEach(v => delete routeParams[ v.name ]);
				this._updateUrl(routeParams);
			});
	}

	clear() {
		this._controlsQuery.forEach(v => v.setValue(null));
	}

	private _updateUrl(routeParams: Object) {
		if (this.type === 'matrix')
			this._router.navigate([ routeParams ], { relativeTo: this._route });
		else
			this._router.navigate([], { queryParams: routeParams, relativeTo: this._route });
	}
}
