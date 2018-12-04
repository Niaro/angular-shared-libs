import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ResponseError, IApiErrorMessage } from '../../models';
import { isEmpty } from 'lodash-es';

@Component({
	selector: 'bp-api-error',
	templateUrl: './api-error.component.html',
	styleUrls: ['./api-error.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiErrorComponent {
	@Input('src')
	get error() { return this._error; }
	set error(value: ResponseError) {
		this._error = value;
		this.messages = value && !isEmpty(value.messages) && value.messages.some(it => !it.field)
			? value.messages.filter(it => !it.field)
			: [];
	}

	private _error: ResponseError;

	messages: IApiErrorMessage[];
}
