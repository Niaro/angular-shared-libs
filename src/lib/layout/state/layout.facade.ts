import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { IPartialState } from './layout.reducer';
import { layoutQuery } from './layout.selectors';
import { CloseSidenav, OpenSidenav } from './layout.actions';

@Injectable()
export class LayoutFacade {
	showSidenav$ = this.store.pipe(select(layoutQuery.getShowSidenav));

	constructor(private store: Store<IPartialState>) {}

	closeSidenav() {
		this.store.dispatch(new CloseSidenav());
	}

	openSidenav() {
		this.store.dispatch(new OpenSidenav());
	}
}
