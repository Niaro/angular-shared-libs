import * as Layout from './layout.actions';

export const LAYOUT_FEATURE_KEY = 'layout-lib';

export interface IState {
	showSidenav: boolean;
	showRightDrawer: boolean;
}

export interface ILayoutPartialState {
	readonly [LAYOUT_FEATURE_KEY]: IState;
}

export const initialState: IState = {
	showSidenav: false,
	showRightDrawer: false
};

export function reducer(state = initialState, action: Layout.Action): IState {
	switch (action.type) {
		case Layout.Actions.OpenSidenav:
			return {
				...state,
				showSidenav: true,
			};

		case Layout.Actions.CloseSidenav:
			return {
				...state,
				showSidenav: false,
			};

		case Layout.Actions.OpenRightDrawer:
			return {
				...state,
				showRightDrawer: true,
			};

		case Layout.Actions.CloseRightDrawer:
			return {
				...state,
				showRightDrawer: false,
			};

		default:
			return state;
	}
}
