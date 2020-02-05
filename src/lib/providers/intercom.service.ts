import { Injectable } from '@angular/core';
import { $ } from '../utils';

import { RouterService } from './router.service';
import { EnvironmentService } from './environment.service';

declare var Intercom: (action: 'boot' | 'update' | 'shutdown', options?: Object) => void;

type BootConfig = { name: string, email: string, created_at?: string; };

@Injectable({
	providedIn: 'root'
})
export class IntercomService {

	private _isFirstBoot = true;

	constructor(
		private router: RouterService,
		private env: EnvironmentService
	) { }

	boot(config?: BootConfig) {
		if (this._isFirstBoot) {
			this._injectScript();
			this._updateOrShutdownOnPageChange();
		}

		this._boot(config);

		this._isFirstBoot = false;
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

	private _boot(config?: BootConfig) {
		Intercom('boot', {
			app_id: this.env.isProd ? 'wnux4tup' : 'ubsz57yv',
			...(config ?? {})
		});
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
