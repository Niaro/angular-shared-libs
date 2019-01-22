import { ActionReducerMap, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { RouterReducerState } from '@ngrx/router-store';

import { environment } from '@bp/environment';
import { ResponseError } from '../models';
import { TelemetryService } from '../providers';

import { logger, hmrAppStateRestorer, initialAppStateFromLocalStorage, storeFreezer } from './meta-reducers';
import { IRouterStateUrl } from './router';

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
	router: RouterReducerState<IRouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const sharedReducer: ActionReducerMap<ISharedState> = {
	router: fromRouter.routerReducer,
};

export const metaReducers: MetaReducer<ISharedState>[] = [
	initialAppStateFromLocalStorage,
	...(environment.dev ? [hmrAppStateRestorer, storeFreezer] : []),
	...(environment.name === 'prod' ? [TelemetryService.logrocketMetaReducer] : [logger])
];

export const selectRouterState = createFeatureSelector<RouterReducerState<IRouterStateUrl>>('router');

export const getRouteData = createSelector(
	selectRouterState,
	it => it && it.state.data
);

export const getData = <T>(state: IApiState<T>) => state.data;
export const getError = <T>(state: IApiState<T>) => state.error;
export const getLoaded = <T>(state: IApiState<T>) => state.loaded;
