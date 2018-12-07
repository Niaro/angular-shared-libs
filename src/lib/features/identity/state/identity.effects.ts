import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LocalStorageService } from 'angular-2-local-storage';
import { tap } from 'rxjs/operators';

import { USER_STATE_PATH } from './identity.reducer';
import * as Identity from './identity.actions';

@Injectable()
export class IdentityEffects {
	@Effect({ dispatch: false })
	change$ = this.actions$.pipe(
		ofType<Identity.Init | Identity.Update>(Identity.Actions.Init, Identity.Actions.Update),
		tap(({ payload }) => this.localStorage.set(USER_STATE_PATH, payload))
	);

	constructor(
		private actions$: Actions,
		private localStorage: LocalStorageService
	) { }
}
