import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { getRouteData } from '../../../state';
import { RightDrawerNames } from '../components/right-drawer';
import { ILayoutPartialState } from './layout.reducer';
import { getShowSidenav, getRightDrawers } from './layout.selectors';
import * as Layout from './layout.actions';

@Injectable()
export class LayoutFacade {
	showSidenav$ = this.store.pipe(select(getShowSidenav));
	rightDrawers$ = this.store.pipe(select(getRightDrawers));

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

	openRightDrawer(name: RightDrawerNames) {
		this.store.dispatch(new Layout.OpenRightDrawer(name));
	}

	closeRightDrawer(name?: RightDrawerNames) {
		const drawerNames: RightDrawerNames[] = name ? [name] : ['primary', 'root'];
		drawerNames.forEach(it => this.store.dispatch(new Layout.CloseRightDrawer(it)));
	}
}
