import { keys } from 'lodash-es';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Dictionary } from '@bp/shared/typings';

import { RouterService } from './router.service';

@Injectable({
	providedIn: 'root'
})
export class ObsoleteUrlsRerouterService {

	rerouteUrlsPerAppMap: Dictionary<Dictionary<string>> = {
		'merchant-admin': {
			'/login': '/intro/login'
		}
	};

	rerouteUrlsMap: Dictionary<string> = {};

	constructor(private _routing: RouterService) {
		const appName = keys(this.rerouteUrlsPerAppMap)
			.find(v => location.hostname.includes(v));

		this.rerouteUrlsMap = this.rerouteUrlsPerAppMap[ appName! ] ?? {};
	}

	init() {
		this._routing.navigationStart$
			.pipe(
				map(v => this.rerouteUrlsMap[ v.url ]),
				filter(v => !!v)
			)
			.subscribe(newUrl => this._routing.ngRouter.navigateByUrl(newUrl));
	}

}
