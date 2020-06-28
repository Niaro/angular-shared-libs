import { Injectable } from '@angular/core';

import { ZoneService } from '@bp/shared/rxjs';

import { MomentService } from './moment.service';
import { ObsoleteUrlsRerouterService } from './obsolete-urls-rerouter.service';
import { TitleService } from './title.service';

/**
 * The service for starting and managing app-wide different services and their intercommuncation at one place
 */
@Injectable({
	providedIn: 'root'
})
export class SharedStartupService {

	constructor(
		private _zone: ZoneService,
		private _obsoleteUrlsRerouter: ObsoleteUrlsRerouterService,
		private _title: TitleService,
		private _moment: MomentService,
	) { }

	init() {
		this._zone.init();

		this._moment.init();

		this._obsoleteUrlsRerouter.init();

		this._title.init();
	}

}
