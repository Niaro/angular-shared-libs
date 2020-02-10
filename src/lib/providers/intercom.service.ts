import { Injectable } from '@angular/core';
import { timer, of } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { environment } from '@bp/environment';

import { $ } from '../utils';
import { RouterService } from './router.service';
import { TelemetryService } from './telemetry.service';
import { EnvironmentService } from './environment.service';

type IntercomCompany = {
	id: string,
	name: string,
	plan?: string,
	website?: string,
	monthly_spend?: number,
	upgraded_at?: number;
	created_at?: number,
};

type IntercomConfig = {
	source?: 'promo-website' | 'merchant-admin',
	app_id?: string;
	user_id?: string;
	email?: string;
	name?: string;
	created_at?: string;
	company?: IntercomCompany;
	[key: string]: string | Object | undefined;
};

type Intercom = {
	(action: 'boot' | 'update', options?: IntercomConfig): void;
	(action: 'shutdown'): void;
	(action: 'getVisitorId'): string | undefined;
	(action: 'trackEvent', event: string, data?: Dictionary<string>): void;
};

declare var Intercom: Intercom;

@Injectable({
	providedIn: 'root'
})
export class IntercomService {

	enabled = !!environment.intercom;

	private _isFirstBoot = true;

	private _userId$ = this.enabled && this._env.isRemoteServer
		? timer(0, 50)
			.pipe(
				map(() => <string><unknown>((<any>window).Intercom && Intercom('getVisitorId'))),
				first(v => !!v)
		)
		: of(undefined);

	constructor(
		private _env: EnvironmentService,
		private _router: RouterService,
		private _telemetry: TelemetryService
	) { }

	boot(config?: IntercomConfig) {
		if (this._isFirstBoot) {
			this._injectScript();
			this._updateOrShutdownOnPageChange();
			this._trackLogrocketSessionOnIntercom();
			this._env.isRemoteServer && this._linkLogrocketSessionsToIntercomUser();
		}

		this._boot(config);

		this._isFirstBoot = false;
	}

	update(options?: IntercomConfig) {
		Intercom('update', options);
	}

	company(company: IntercomCompany) {
		this.update({ company });
	}

	getUserId(): Promise<string | undefined> {
		return this._userId$.toPromise();
	}

	trackEvent(event: string, data?: Dictionary<string>) {
		Intercom('trackEvent', event, data);
	}

	private async _linkLogrocketSessionsToIntercomUser() {
		const userId = await this.getUserId();
		if (userId)
			this.update({
				logrocket_URL: this._telemetry.getUserLogrocketUrl(userId)
			});
	}

	private async _trackLogrocketSessionOnIntercom() {
		const sessionURL = await this._telemetry.getSessionUrl();
		this.trackEvent('LogRocket', { sessionURL });
	}

	private _boot(config?: IntercomConfig) {
		Intercom('boot', {
			app_id: environment.intercom,
			...(config ?? {})
		});
	}

	private _updateOrShutdownOnPageChange() {
		this._router.navigationEnd$.subscribe(v => {
			this.update();
			v.url.includes('intro') && this._shutdown();
		});
	}

	private _shutdown() {
		Intercom('shutdown');
	}

	private _injectScript() {
		$.addScriptCodeToBody({
			code: `(function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', w.intercomSettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/${environment.intercom}'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();`
		});
	}
}
