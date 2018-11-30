import * as m from 'moment';
import { ActionReducer, Action } from '@ngrx/store';

export function storeFreezer<T, V extends Action = Action>(
	reducer: ActionReducer<T, V>
): ActionReducer<any, any> {
	return (state, action): any => {
		state = state || {};

		deepFreeze(state);

		// guard against trying to freeze null or undefined types
		if (action.payload)
			deepFreeze(action.payload);

		const nextState = reducer(state, action);

		deepFreeze(nextState);

		return nextState;
	};
}

function deepFreeze(o) {
	Object.freeze(o);

	const oIsFunction = typeof o === 'function';
	const hasOwnProp = Object.prototype.hasOwnProperty;

	Object.getOwnPropertyNames(o).forEach(prop => {
		if (hasOwnProp.call(o, prop)
			&& (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true)
			&& o[prop] !== null
			&& (typeof o[prop] === 'object' || typeof o[prop] === 'function')
			&& !Object.isFrozen(o[prop])
			&& !m.isMoment(o[prop])
			) {
			deepFreeze(o[prop]);
		}
	});

	return o;
}
