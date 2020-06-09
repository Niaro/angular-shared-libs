import { ActionCreator } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

export type Action<T = undefined> = T extends undefined
	? ActionCreator<string, () => TypedAction<string>>
	: ActionCreator<string, (props: T) => T & TypedAction<string>>;
