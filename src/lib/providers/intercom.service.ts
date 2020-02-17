import { Injectable } from '@angular/core';
import { timer, of, defer } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { environment as env } from '@bp/environment';

import { $ } from '../utils';
import { RouterService } from './router.service';
import { TelemetryService } from './telemetry.service';

type IntercomCompany = {
	id: string,
	name: string,
	plan?: string,
	website?: string,
	monthly_spend?: number,
	upgraded_at?: number;
	created_at?: number,
};

type IntercomBootConfig = {
	source?: string;
	app_id?: string;
};

type IntercomConfig = {
	user_id?: string;
	email?: string;
	name?: string;
	created_at?: string;
	company?: IntercomCompany;
	[ key: string ]: string | Object | undefined;
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

	enabled = !!env.intercom;

	private _isFirstBoot = true;

	private _userId?: string;

	private _userId$ = this.enabled
		? defer(() => this._userId
			? of(this._userId)
			: timer(0, 50)
				.pipe(
					map(() => <string> <unknown>((<any> window).Intercom && Intercom('getVisitorId'))),
					first(v => !!v)
				)
		)
		: of(undefined);

	constructor(
		private _router: RouterService,
		private _telemetry: TelemetryService
	) { }

	boot(config?: IntercomBootConfig) {
		console.warn('Intercom boot', config);
		if (!this._isFirstBoot || !this.enabled)
			return;

		this._injectScript();
		this._boot(config);
		this._whenPageChangeUpdateIntercom();
		this._whenTelemetryEnabledSaveSessionOnIntercom();

		this._isFirstBoot = false;
	}

	update(config?: IntercomConfig) {
		console.warn('Intercom update', config);
		if (!this.enabled)
			return;

		this._userId = config?.user_id;
		this._whenTelemetryEnabledSaveSessionOnIntercom();
		Intercom('update', config);
	}

	company(company: IntercomCompany) {
		if (!this.enabled)
			return;

		this.update({ company });
	}

	getUserId(): Promise<string | undefined> {
		return this._userId$.toPromise();
	}

	trackEvent(event: string, data?: Dictionary<string>) {
		if (!this.enabled)
			return;

		Intercom('trackEvent', event, data);
	}

	shutdown() {
		if (!this.enabled)
			return;

		Intercom('shutdown');
	}

	private _whenTelemetryEnabledSaveSessionOnIntercom() {
		if (!this._telemetry.enabled)
			return;

		this._trackLogrocketSessionOnIntercom();
		this._linkLogrocketSessionsToIntercomUser();
	}

	private async _linkLogrocketSessionsToIntercomUser() {
		const userId = await this.getUserId();

		if (!userId)
			return;

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
			app_id: env.intercom,
			...(config ?? {})
		});
	}

	private _whenPageChangeUpdateIntercom() {
		this._router.navigationEnd$.subscribe(v => this.update());
	}

	private _injectScript() {
		$.addScriptCodeToBody({
			code: `(function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', w.intercomSettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/${ env.intercom }'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();`
		});
	}
}
