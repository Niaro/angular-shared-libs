import { ActionReducer, Action } from '@ngrx/store';

const LOG_STYLE = 'color: #59ff95; font-weight: 100;';
const ERROR_BG_STYLE = c => `color: ${c}; background: black; border: 1px solid ${c}; border-radius: 5px; padding: 2px 5px;`;
const ERROR_LOG_STYLE = `${LOG_STYLE}${ERROR_BG_STYLE('#ff3636')}`;

export function logger<T, V extends Action = Action>(reducer: ActionReducer<T, V>): ActionReducer<T, V> {
	return (state: T, action: V): any => {
		const result = reducer(state, action);
		const logStyle = /((F|f)ailure)|((E|e)rror)|ROUTE_ERROR/.test(action.type) ? ERROR_LOG_STYLE : LOG_STYLE;

		console.groupCollapsed(`%c${action.type}`, logStyle);

		console.groupCollapsed(`%cTrace`, `${ERROR_BG_STYLE('#23b3ec')}`);
		console.trace();
		console.groupEnd();

		console.log('%cprev state', logStyle, state);
		console.log('%caction', logStyle, action);
		console.log('%cnext state', logStyle, result);

		console.groupEnd();

		return result;
	};
}
