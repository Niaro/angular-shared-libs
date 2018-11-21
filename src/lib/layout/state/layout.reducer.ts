import { LayoutAction, LayoutActions } from './layout.actions';

export const LAYOUT_FEATURE_KEY = 'layout-lib';

export interface IState {
	showSidenav: boolean;
}

export interface IPartialState {
	readonly [LAYOUT_FEATURE_KEY]: IState;
}

export const initialState: IState = {
	showSidenav: false,
};

export function reducer(state: IState = initialState, action: LayoutAction): IState {
	switch (action.type) {
		case LayoutActions.CloseSidenav:
			return {
				...state,
				showSidenav: false,
			};

		case LayoutActions.OpenSidenav:
			return {
				...state,
				showSidenav: true,
			};

		default:
			return state;
	}
}

export const getShowSidenav = (state: IState) => state.showSidenav;
