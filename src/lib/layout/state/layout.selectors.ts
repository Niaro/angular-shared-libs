import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLayout from './layout.reducer';

// Lookup the 'Layout' feature state managed by NgRx
const getLayoutState = createFeatureSelector<fromLayout.IState>(fromLayout.LAYOUT_FEATURE_KEY);

export const getShowSidenav = createSelector(
	getLayoutState,
	fromLayout.getShowSidenav
);

export const layoutQuery = {
	getShowSidenav,
};
