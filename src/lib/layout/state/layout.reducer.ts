import { LayoutAction, LayoutActionTypes } from './layout.actions';

export const LAYOUT_FEATURE_KEY = 'layout-feature';

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
		case LayoutActionTypes.CloseSidenav:
			return {
				...state,
				showSidenav: false,
			};

		case LayoutActionTypes.OpenSidenav:
			return {
				...state,
				showSidenav: true,
			};

		default:
			return state;
	}
}

export const getShowSidenav = (state: IState) => state.showSidenav;
