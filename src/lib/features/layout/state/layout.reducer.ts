import * as Layout from './layout.actions';
import { max, map } from 'lodash-es';

export const LAYOUT_FEATURE_KEY = 'layout-feature';

export interface IState {
	showSidenav: boolean;
	rightDrawers: {
		[name: string]: {
			show: boolean;
			zindex: number | null;
		}
	};
}

export interface ILayoutPartialState {
	readonly [LAYOUT_FEATURE_KEY]: IState;
}

export const initialState: IState = {
	showSidenav: false,
	rightDrawers: {}
};

export function reducer(state = initialState, action: Layout.Action): IState {
	switch (action.type) {
		case Layout.Actions.OpenSidenav:
		case Layout.Actions.CloseSidenav:
			return {
				...state,
				showSidenav: action.type === Layout.Actions.OpenSidenav,
			};

		case Layout.Actions.OpenRightDrawer: {
			const maxCurrentZIndex = max(map(state.rightDrawers, ({ zindex }) => zindex)) || 10;
			return {
				...state,
				rightDrawers: {
					...state.rightDrawers,
					[action.payload]: {
						show: true,
						zindex: maxCurrentZIndex + 1
					}
				},
			};
		}

		case Layout.Actions.CloseRightDrawer:
			return {
				...state,
				rightDrawers: {
					...state.rightDrawers,
					[action.payload]: {
						show: false,
						zindex: null
					}
				},
			};

		default:
			return state;
	}
}
