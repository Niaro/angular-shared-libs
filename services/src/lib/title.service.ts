import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, PRIMARY_OUTLET } from '@angular/router';
import { MODAL_OUTLET } from '@bp/shared/models/core';
import { Dictionary } from '@bp/shared/typings';
import { $ } from '@bp/shared/utilities';
import { isEmpty, keys, mapValues, omit, omitBy, values } from 'lodash-es';
import { RouterService } from './router.service';

const TITLES_DELIMITER = ' – ';
const OUTLETS_DELIMITER = ' / ';

@Injectable({
	providedIn: 'root'
})
export class TitleService {

	private _default = $.getMeta('title') ?? '';

	private _previousTitledOutlets: string[] = [];

	/**
		Title with the mask substitutions if present
	 */
	private _rawTitle!: string;

	private _substitutionsReducers: Dictionary<(rawTitle: string) => string> = {};

	private _ignited = false;

	constructor(
		private _router: RouterService,
		private _route: ActivatedRoute,
		private _ngTitle: Title
	) { }

	init() {
		if (this._ignited)
			return;

		this._router.navigationEnd$
			.subscribe(() => this._updateTitle());

		this._ignited = true;
	}

	setMaskValue(maskValue: { [ maskName: string ]: string; }) {
		this._substitutionsReducers = {
			...this._substitutionsReducers,
			// tslint:disable-next-line: no-unnecessary-type-annotation
			...mapValues(maskValue, (v, k) => (rawTitle: string) => rawTitle.replace(`\{${ k }\}`, v))
		};

		this._substituteMasksAndSetTitle(this._rawTitle);
	}

	private _substituteMasksAndSetTitle(rawTitle: string = '') {
		this._ngTitle.setTitle(
			values(this._substitutionsReducers)
				.reduce(
					(title, substitute) => substitute(title),
					rawTitle
				)
		);
	}

	private _updateTitle() {
		const outletsTitles = mapValues(
			this._harvestTitles(),
			v => v
				.reverse()
				.join(TITLES_DELIMITER)
		);
		const primaryTitle = outletsTitles[ PRIMARY_OUTLET ];
		const modalTitle = outletsTitles[ MODAL_OUTLET ];
		const rightDrawersTitle = values(omit(outletsTitles, PRIMARY_OUTLET, MODAL_OUTLET))
			.reverse()
			.join(OUTLETS_DELIMITER);

		this._rawTitle = (modalTitle
			? modalTitle + TITLES_DELIMITER
			: (rightDrawersTitle ? rightDrawersTitle + OUTLETS_DELIMITER : '')
			+ (primaryTitle ? primaryTitle + TITLES_DELIMITER : ''))
			+ this._default;

		this._substituteMasksAndSetTitle(this._rawTitle);
	}

	private _harvestTitles() {
		const walkedMap = new Map<ActivatedRouteSnapshot, number>();

		// we need the previous variable to restore the outlets titles order
		let outletsTitles = this._keysToObject(this._previousTitledOutlets);
		let curr: ActivatedRouteSnapshot | null = this._route.snapshot;
		let currentOutlet = PRIMARY_OUTLET;

		while (curr) {
			if (curr.outlet !== PRIMARY_OUTLET)
				currentOutlet = curr.outlet;

			const hasWalked = walkedMap.has(curr);

			if (!hasWalked && curr.data?.title)
				outletsTitles[ currentOutlet ] = [ ...(outletsTitles[ currentOutlet ] || []), curr.data?.title ];

			// tslint:disable-next-line: no-unnecessary-type-annotation
			const toCheckChildIndex: number = (walkedMap.get(curr) || 0) + 1;

			// tslint:disable-next-line: early-exit
			if (curr.children.length && (!hasWalked || toCheckChildIndex < curr.children.length)) {
				const next = hasWalked ? toCheckChildIndex : 0;
				walkedMap.set(curr, next);
				curr = curr.children[ next ];
			} else
				curr = curr.parent ?? null;
		}

		outletsTitles = omitBy(outletsTitles, isEmpty);
		this._previousTitledOutlets = keys(outletsTitles);

		return outletsTitles;
	}

	private _keysToObject(val: string[] = []): Dictionary<string[]> {
		return val.reduce(
			(acc, v) => (<Dictionary<string[]>> { ...acc, [ v ]: [] }),
			<Dictionary<string[]>> {}
		);
	}
}
