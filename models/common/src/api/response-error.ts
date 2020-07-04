import { assign, camelCase, get, has, isArray, isString, lowerCase } from 'lodash-es';

import { HttpErrorResponse } from '@angular/common/http';

import { DeepPartial } from '@bp/shared/typings';

import { StatusCode, STATUS_CODE_MESSAGES } from './status-code';

export class ResponseError {

	static get notFound() {
		return new ResponseError({ status: StatusCode.NotFound });
	}

	status?: StatusCode;

	statusText?: string;

	messages: IApiErrorMessage[] = [];

	url?: string | null;

	get isForbidden() {
		return this.status === StatusCode.Forbidden;
	}

	get isInternalServerError() {
		return this.status === StatusCode.InternalServerError;
	}

	constructor(e: HttpErrorResponse | IApiErrorResponse | DeepPartial<ResponseError> | string) {
		if (isString(e))
			this.messages = [ { message: e } ];
		else if (e instanceof HttpErrorResponse) {
			this.url = e.url;
			this.status = this._parseStatus(e);
			this.statusText = get(STATUS_CODE_MESSAGES, this.status);

			if (e.error)
				this._extractMessagesFromApiErrorResponse(e.error);
		} else if (has(e, 'response')) {
			e = <IApiErrorResponse> e;
			this.status = e.response.code;
			this.statusText = get(STATUS_CODE_MESSAGES, this.status);
			this._extractMessagesFromApiErrorResponse(e);
		} else
			assign(this, e);

		if (this.status === StatusCode.NotFound)
			this.messages = [ {
				message: 'The resource has not been found',
			} ];
		else if ([ StatusCode.InternalServerError, StatusCode.UnknownError ].includes(this.status!))
			this.messages = [ {
				message: 'The request to the server has failed.',
				type: 'Please check your connection and try again later or contact support if the problem persists',
			} ];
		else if (this.status === StatusCode.RateLimited)
			this.messages = [ {
				message: 'You are being rate limited due to spamming the server with requests',
				type: 'Please repeat a bit later',
			} ];

		this.messages.forEach(it => it.field = camelCase(it.field));
	}

	private _extractMessagesFromApiErrorResponse(e: IApiErrorResponse) {
		this.messages = e.result
			? isArray(e.result) ? e.result : [ e.result ]
			: e.response && e.response.message && [ { message: lowerCase(e.response.message) } ] || [];
	}

	private _parseStatus(e: HttpErrorResponse) {
		if (e.status! >= 500)
			return StatusCode.InternalServerError;

		return e.status === 0 || e[ 'statusText' ] === 'Unknown Error'
			? StatusCode.UnknownError
			: e.status!;
	}
}

export interface IApiErrorResponse {

	response: {
		status: string;
		code: number;
		message: string;
	};

	result?: IApiErrorMessage | IApiErrorMessage[];
}

export interface IApiErrorMessage {

	message: string;

	type?: string;

	field?: string;

}
