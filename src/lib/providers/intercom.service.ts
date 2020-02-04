import { Injectable } from '@angular/core';
import { $ } from '../utils';

import { RouterService } from './router.service';
import { EnvironmentService } from './environment.service';

declare var Intercom: (action: 'boot' | 'update' | 'shutdown', options?: Object) => void;

@Injectable({
	providedIn: 'root'
})
export class IntercomService {

	private _inited = false;

	constructor(
		private router: RouterService,
		private env: EnvironmentService
	) { }

	init(config?: { name: string, email: string, created_at?: string; }) {
		if (!this._inited) {
			this._injectScript();
			this._updateOrShutdownOnPageChange();
		}

		Intercom('boot', {
			app_id: this.env.isProd ? 'wnux4tup' : 'ubsz57yv',
			...(config ?? {})
		});

		this._inited = true;
	}

	company(company: {
		id: string,
		name: string,
		plan?: string,
		website?: string,
		monthly_spend?: number,
		upgraded_at?: number;
		created_at?: number,
	}) {
		this._update({ company });
	}

	private _updateOrShutdownOnPageChange() {
		this.router.navigationEnd$.subscribe(v => {
			this._update();
			v.url.includes('intro') && this._shutdown();
		});
	}

	private _update(options?: Object) {
		Intercom('update', options);
	}

	private _shutdown() {
		Intercom('shutdown');
	}

	private _injectScript() {
		$.addScriptCodeToBody({
			code: `(function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', w.intercomSettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/wnux4tup'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();`
		});
	}
}
