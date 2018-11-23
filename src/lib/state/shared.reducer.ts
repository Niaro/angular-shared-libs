import { ActionReducerMap, MetaReducer, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '@bp/environment';
import { logger, appStateRestorer } from './meta-reducers';
import { ResponseError } from '../models';

export interface IApiState<T> {
	data: T;
	loaded: boolean;
	error?: ResponseError;
}

export const initialApiState: IApiState<any> = {
	data: null,
	loaded: false,
	error: null
};

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface ISharedState {
	router: fromRouter.RouterReducerState;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const sharedReducers: ActionReducerMap<ISharedState> = {
	router: fromRouter.routerReducer,
};

export const metaReducers: MetaReducer<ISharedState>[] = environment.dev
	? [appStateRestorer, storeFreeze, logger]
	: [];

export const selectRouterState = createFeatureSelector<fromRouter.RouterReducerState>('router');

export const getFirstChildRouteData = createSelector(
	selectRouterState,
	({ state }: fromRouter.RouterReducerState) => state.root.firstChild.data
);

export const getData = <T>(state: IApiState<T>) => state.data;
export const getError = <T>(state: IApiState<T>) => state.error;
export const getLoaded = <T>(state: IApiState<T>) => state.loaded;
