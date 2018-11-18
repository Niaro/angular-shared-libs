import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { flatMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { interval } from 'rxjs';
import { environment } from '@bp/environment';

@Injectable()
export class AppUpdateService {
	constructor(
		updates: SwUpdate,
		snackBar: MatSnackBar
	) {
		if (environment.dev)
			return this;

		updates.available
			.pipe(
				tap(() => snackBar.open('A new version is available. The page will be reloaded in a moment.')),
				flatMap(() => updates.activateUpdate())
			)
			.subscribe(() => document.location.reload());

		interval(6 * 60 * 60)
			.subscribe(() => updates.checkForUpdate());
	}
}
