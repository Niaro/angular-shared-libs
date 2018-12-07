import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { getRouteData } from '../../../state';
import { ILayoutPartialState } from './layout.reducer';
import { getShowSidenav, getShowRightDrawer } from './layout.selectors';
import * as Layout from './layout.actions';

@Injectable()
export class LayoutFacade {
	showSidenav$ = this.store.pipe(select(getShowSidenav));
	showRightDrawer$ = this.store.pipe(select(getShowRightDrawer));
	fullscreen$ = this.store.pipe(
		select(getRouteData),
		map(v => !!v && v.fullscreen)
	);

	constructor(private store: Store<ILayoutPartialState>) { }

	openSidenav() {
		this.store.dispatch(new Layout.OpenSidenav());
	}

	closeSidenav() {
		this.store.dispatch(new Layout.CloseSidenav());
	}

	closeRightDrawer() {
		this.store.dispatch(new Layout.CloseRightDrawer());
	}

	openRightDrawer() {
		this.store.dispatch(new Layout.OpenRightDrawer());
	}
}
