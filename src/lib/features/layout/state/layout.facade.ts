import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { getRouteData } from '../../../state';
import { ILayoutPartialState } from './layout.reducer';
import { getShowSidenav, getShowRightDrawer } from './layout.selectors';
import * as Layout from './layout.actions';

@Injectable()
export class LayoutFacade {
	showSidenav$ = this.store.pipe(select(getShowSidenav));
	showRightDrawer$ = this.store.pipe(select(getShowRightDrawer));

	fullscreen$ = new BehaviorSubject<boolean>(false);
	get fullscreen() { return this.fullscreen$.value; }

	constructor(private store: Store<ILayoutPartialState>) {
		this.store
			.pipe(
				select(getRouteData),
				map(v => !!v && !!v.fullscreen)
			)
			.subscribe(this.fullscreen$);
	}

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
