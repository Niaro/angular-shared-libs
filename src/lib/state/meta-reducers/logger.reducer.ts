import { ActionReducer, Action } from '@ngrx/store';

const LOG_STYLE = 'color: #59ff95; font-weight: 100';

export function logger<T, V extends Action = Action>(reducer: ActionReducer<T, V>): ActionReducer<T, V> {
	return (state: T, action: V): any => {
		const result = reducer(state, action);

		console.groupCollapsed(`%c${action.type}`, LOG_STYLE);

		console.groupCollapsed(`%cTrace`, 'color: #23b3ec');
		console.trace();
		console.groupEnd();

		console.log('%cprev state', LOG_STYLE, state);
		console.log('%caction', LOG_STYLE, action);
		console.log('%cnext state', LOG_STYLE, result);

		console.groupEnd();

		return result;
	};
}
