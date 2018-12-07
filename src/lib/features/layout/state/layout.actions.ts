import { Action } from '@ngrx/store';

export enum Actions {
	OpenSidenav = '[Layout] Open Sidenav',
	CloseSidenav = '[Layout] Close Sidenav',
	OpenRightDrawer = '[Layout] Open Right Drawer',
	CloseRightDrawer = '[Layout] Close Right Drawer',
}

export class OpenSidenav implements Action {
	readonly type = Actions.OpenSidenav;
}

export class CloseSidenav implements Action {
	readonly type = Actions.CloseSidenav;
}

export class OpenRightDrawer implements Action {
	readonly type = Actions.OpenRightDrawer;
}

export class CloseRightDrawer implements Action {
	readonly type = Actions.CloseRightDrawer;
}

export type Action = OpenSidenav
	| CloseSidenav
	| OpenRightDrawer
	| CloseRightDrawer;
