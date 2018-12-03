import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { keys } from 'lodash-es';
import { environment } from '@bp/environment';

export const APP_STATE_PREFIX = '[bridgerpay]';

export function initialAppStateFromLocalStorage(reducer: ActionReducer<any>): ActionReducer<any> {
	return function (state, action) {
		const newState = reducer(state, action);
		return environment.version.revision >= 1 && [<string>INIT, <string>UPDATE].includes(action.type)
			? { ...newState, ...extractStateFromLocalStorage() }
			: newState;
	};
}

function extractStateFromLocalStorage(): Object {
	return keys(localStorage).reduce((state: any, storageKey) => {
		if (storageKey.includes(APP_STATE_PREFIX)) {
			const stateKeys = storageKey
				.replace(`${APP_STATE_PREFIX}.`, '')
				.split('.');

			let currentStateRef = state;
			stateKeys.forEach((key, index) => {
				if (index === stateKeys.length - 1) {
					currentStateRef[key] = JSON.parse(localStorage.getItem(storageKey));
					return;
				}
				currentStateRef[key] = currentStateRef[key] || {};
				currentStateRef = currentStateRef[key];
			});
		}
		return state;
	}, {});
}
