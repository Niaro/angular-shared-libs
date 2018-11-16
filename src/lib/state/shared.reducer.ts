import { ActionReducerMap, MetaReducer, Action } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { environment } from '@environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { logger, appStateRestorer } from './meta-reducers';

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
