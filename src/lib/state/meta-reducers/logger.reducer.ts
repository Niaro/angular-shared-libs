import { ActionReducer, Action } from '@ngrx/store';

const LOG_STYLE = 'color: ##59ff95; font-weight: 100';

export function logger<T, V extends Action = Action>(reducer: ActionReducer<T, V>): ActionReducer<T, V> {
	return (state: T, action: V): any => {
		const result = reducer(state, action);

		console.groupCollapsed(`%c${action.type}`, LOG_STYLE);
		console.log('%cprev state', state, LOG_STYLE);
		console.log('%caction', action, LOG_STYLE);
		console.log('%cnext state', result, LOG_STYLE);
		console.groupEnd();

		return result;
	};
}
