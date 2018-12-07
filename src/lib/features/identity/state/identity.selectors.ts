import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState, IDENTITY_FEATURE_KEY } from './identity.reducer';

const getIdentityState = createFeatureSelector<IState>(IDENTITY_FEATURE_KEY);

export const getUser = createSelector(
	getIdentityState,
	it => it.user
);
