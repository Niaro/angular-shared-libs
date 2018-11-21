import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { getFirstChildRouteData } from '../../state';
import { IPartialState } from './layout.reducer';
import { getShowSidenav } from './layout.selectors';
import { CloseSidenav, OpenSidenav } from './layout.actions';

@Injectable()
export class LayoutFacade {
	showSidenav$ = this.store.pipe(select(getShowSidenav));
	fullscreen$ = this.store.pipe(
		select(getFirstChildRouteData),
		map(v => !!v.fullscreen)
	);

	constructor(private store: Store<IPartialState>) { }

	closeSidenav() {
		this.store.dispatch(new CloseSidenav());
	}

	openSidenav() {
		this.store.dispatch(new OpenSidenav());
	}
}
