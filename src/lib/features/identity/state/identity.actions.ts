import { Action } from '@ngrx/store';
import { User } from '../models';

export enum Actions {
	Init = '[Identity] Init',
	Update = '[Identity] Update'
}

export class Init implements Action {
	readonly type = Actions.Init;

	constructor(public payload: User) { }
}

export class Update implements Action {
	readonly type = Actions.Update;

	constructor(public payload: Partial<User> | null) { }
}

export type Action = Init | Update;
