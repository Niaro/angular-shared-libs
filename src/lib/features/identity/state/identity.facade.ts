import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { TelemetryService } from '../../../providers';
import { User } from '../models';
import { IIdentityPartialState } from './identity.reducer';
import { getUser } from './identity.selectors';
import * as Identity from './identity.actions';

@Injectable()
export class IdentityFacade {
	user$ = this.store.pipe(select(getUser));

	constructor(private store: Store<IIdentityPartialState>, private telemetry: TelemetryService) {
		this.user$.subscribe(user => user && this.telemetry.registerUser(user.userName));
	}

	init(user: User) {
		this.store.dispatch(new Identity.Init(user));
	}

	update(user: Partial<User> | null) {
		this.store.dispatch(new Identity.Update(user));
	}
}
