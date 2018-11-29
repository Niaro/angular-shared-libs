import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { getRouteData } from '../../state';
import { IPartialState } from './layout.reducer';
import { getShowSidenav } from './layout.selectors';
import { CloseSidenav, OpenSidenav } from './layout.actions';

@Injectable()
export class LayoutFacade {
	showSidenav$ = this.store.pipe(select(getShowSidenav));
	fullscreen$ = this.store.pipe(
		select(getRouteData),
		map(v => !!v && v.fullscreen)
	);

	constructor(private store: Store<IPartialState>) { }

	closeSidenav() {
		this.store.dispatch(new CloseSidenav());
	}

	openSidenav() {
		this.store.dispatch(new OpenSidenav());
	}
}
