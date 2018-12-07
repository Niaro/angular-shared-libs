import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState, LAYOUT_FEATURE_KEY } from './layout.reducer';

const getLayoutState = createFeatureSelector<IState>(LAYOUT_FEATURE_KEY);

export const getShowSidenav = createSelector(
	getLayoutState,
	it => it.showSidenav
);

export const getShowRightDrawer = createSelector(
	getLayoutState,
	it => it.showRightDrawer
);
