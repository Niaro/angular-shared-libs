import { Directive, Input } from '@angular/core';
import { QueryParamsHandling, Router, ActivatedRoute, UrlTree } from '@angular/router';
import { isObject } from 'lodash-es';

import { attrBoolValue } from '@bp/shared/utils';

@Directive()
export class OutletLinkRelativeToTargetBaseDirective {

	@Input()
	set outletLinkRelativeToParent(outlets: Dictionary<any[]>) {
		this._setCommands(outlets);
		this._relativeTo = this._route.parent;
	}

	@Input()
	set outletLinkRelativeToRoot(outlets: Dictionary<any[]>) {
		this._setCommands(outlets);
		this._relativeTo = this._route.root;
	}

	@Input() queryParams!: { [k: string]: any; };

	@Input() fragment!: string;

	@Input() queryParamsHandling!: QueryParamsHandling;

	@Input() preserveFragment!: boolean;

	@Input() skipLocationChange!: boolean;

	@Input()
	replaceUrl!: boolean;

	protected get _urlTree(): UrlTree {
		return this._router.createUrlTree(this._commands, {
			relativeTo: this._relativeTo,
			queryParams: this.queryParams,
			fragment: this.fragment,
			queryParamsHandling: this.queryParamsHandling,
			preserveFragment: attrBoolValue(this.preserveFragment),
		});
	}

	protected _commands: any[] = [];

	protected _relativeTo!: ActivatedRoute | null;

	constructor(
		protected _router: Router,
		protected _route: ActivatedRoute
	) { }

	private _setCommands(outlets: Dictionary<any[]>) {
		if (!isObject(outlets))
			throw new Error('OutletLinkRelativeToTarget accepts only a dictionary where the keys are the outlet names and the values are the route commands');
		this._commands = [{ outlets }];
	}
}
