import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, PRIMARY_OUTLET } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { mapValues, omit, values, isEmpty, omitBy, keys } from 'lodash-es';

import { $ } from '../utils';

import { RouterService } from './router.service';
import { MODAL_OUTLET } from '../models';

const TITLES_DELIMITER = ' – ';
const OUTLETS_DELIMITER = ' / ';

@Injectable()
export class TitleService {

	private default = $.getMeta('title') ?? '';

	private previousTitledOutlets: string[] = [];

	/**
		Title with the mask substitutions if present
	 */
	private rawTitle!: string;

	private substitutionsReducers: Dictionary<(rawTitle: string) => string> = {};

	private ignited = false;

	constructor(
		private router: RouterService,
		private route: ActivatedRoute,
		private ngTitle: Title
	) { }

	ignite() {
		if (this.ignited)
			return;

		this.router.navigationEnd$
			.subscribe(() => this.updateTitle());

		this.ignited = true;
	}

	setMaskValue(maskValue: { [maskName: string]: string }) {
		this.substitutionsReducers = {
			...this.substitutionsReducers,
			...mapValues(maskValue, (v, k) => (rawTitle: string) => rawTitle.replace(`\{${k}\}`, v))
		};

		this.substituteMasksAndSetTitle(this.rawTitle);
	}

	private substituteMasksAndSetTitle(rawTitle: string = '') {
		this.ngTitle.setTitle(
			values(this.substitutionsReducers).reduce((title, substitute) => substitute(title), rawTitle)
		);
	}

	private updateTitle() {
		const outletsTitles = mapValues(this.harvestTitles(), v => v.reverse().join(TITLES_DELIMITER));
		const primaryTitle = outletsTitles[PRIMARY_OUTLET];
		const modalTitle = outletsTitles[MODAL_OUTLET];
		const rightDrawersTitle = values(omit(outletsTitles, PRIMARY_OUTLET, MODAL_OUTLET)).reverse().join(OUTLETS_DELIMITER);

		this.rawTitle = (modalTitle
			? modalTitle + TITLES_DELIMITER
			: (rightDrawersTitle ? rightDrawersTitle + OUTLETS_DELIMITER : '') + (primaryTitle ? primaryTitle + TITLES_DELIMITER : ''))
			+ this.default;

		this.substituteMasksAndSetTitle(this.rawTitle);
	}

	private harvestTitles() {
		const walkedMap = new Map<ActivatedRouteSnapshot, number>();

		// we need the previous variable to restore the outlets titles order
		let outletsTitles: Dictionary<string[]> = this.keysToObject(this.previousTitledOutlets);
		let curr: ActivatedRouteSnapshot | null = this.route.snapshot;
		let currentOutlet = PRIMARY_OUTLET;

		while (curr) {
			if (curr.outlet !== PRIMARY_OUTLET)
				currentOutlet = curr.outlet;

			const hasWalked = walkedMap.has(curr);

			if (!hasWalked && curr.data?.title)
				outletsTitles[currentOutlet] = [...(outletsTitles[currentOutlet] || []), curr.data?.title];

			const toCheckChildIndex: number = (walkedMap.get(curr) || 0) + 1;

			if (curr.children.length && (!hasWalked || toCheckChildIndex < curr.children.length)) {
				const next = hasWalked ? toCheckChildIndex : 0;
				walkedMap.set(curr, next);
				curr = curr.children[next];
			} else if (curr.parent)
				curr = curr.parent;
			else
				curr = null;
		}

		outletsTitles = omitBy(outletsTitles, v => isEmpty(v));
		this.previousTitledOutlets = keys(outletsTitles);
		return outletsTitles;
	}

	private keysToObject(val: string[] = []) {
		return val.reduce((acc, v) => ({ ...acc, [v]: [] }), {});
	}
}
