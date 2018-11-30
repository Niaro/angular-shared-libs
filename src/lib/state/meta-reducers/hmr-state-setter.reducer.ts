import { ActionReducer, Action, INIT } from '@ngrx/store';
const APP_STATE = '[BP]:APP_STATE';

export function hmrAppStateRestorer<T, V extends Action = Action>(
	reducer: ActionReducer<T, V>
): ActionReducer<T, V> {
	return (state: T, action: V): any => {
		const newState = reducer(state, action);
		return action.type === INIT
			? window[APP_STATE] || newState
			: (window[APP_STATE] = newState);
	};
}
