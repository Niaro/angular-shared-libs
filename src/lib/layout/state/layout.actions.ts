import { Action } from '@ngrx/store';

export enum LayoutActions {
	OpenSidenav = '[Layout] Open Sidenav',
	CloseSidenav = '[Layout] Close Sidenav',
}

export class OpenSidenav implements Action {
	readonly type = LayoutActions.OpenSidenav;
}

export class CloseSidenav implements Action {
	readonly type = LayoutActions.CloseSidenav;
}

export type LayoutAction = OpenSidenav | CloseSidenav;
