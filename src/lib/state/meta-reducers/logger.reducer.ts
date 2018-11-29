import { ActionReducer, Action } from '@ngrx/store';

export function logger<T, V extends Action = Action>(
	reducer: ActionReducer<T, V>
): ActionReducer<T, V> {
	return (state: T, action: V): any => {
		const result = reducer(state, action);

		console.groupCollapsed(action.type);
		console.log('prev state', state);
		console.log('action', action);
		console.log('next state', result);
		console.groupEnd();

		return result;
	};
}
