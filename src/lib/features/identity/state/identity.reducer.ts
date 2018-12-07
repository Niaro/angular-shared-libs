import { cloneDeep } from 'lodash-es';
import * as Identity from './identity.actions';
import { User } from '../models';

export const IDENTITY_FEATURE_KEY = 'identity-feature';
export const USER_STATE_KEY = 'user';
export const USER_STATE_PATH = `${IDENTITY_FEATURE_KEY}.${USER_STATE_KEY}`;

export interface IState {
	[USER_STATE_KEY]: User | null;
}

export interface IIdentityPartialState {
	readonly [IDENTITY_FEATURE_KEY]: IState;
}

export const initialState: IState = {
	user: null
};

export function reducer(state = initialState, action: Identity.Action): IState {
	switch (action.type) {
		case Identity.Actions.Init:
			return {
				...state,
				user: action.payload
			};

		case Identity.Actions.Update:
			return {
				...state,
				user: action.payload
					? { ...cloneDeep(state.user), ...action.payload }
					: null
			};

		default:
			return state;
	}
}
