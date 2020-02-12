import { StatusCode, STATUS_CODE_MESSAGES } from './status-code';
import { HttpErrorResponse } from '@angular/common/http';
import { isArray, camelCase, lowerCase, get, isString, has, assign } from 'lodash-es';

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
			this.messages = [{ message: e }];
		else if (e instanceof HttpErrorResponse) {
			this.url = e.url;
			this.status = e.status! >= 500 || e.status === 0 || e['statusText'] === 'Unknown Error'
				? StatusCode.InternalServerError
				: e.status!;
			this.statusText = get(STATUS_CODE_MESSAGES, this.status);

			if (this.status === StatusCode.NotFound)
				this.messages = [{
					message: 'The resource has not been found',
				}];
			else if (this.status === StatusCode.InternalServerError)
				this.messages = [{
					message: 'The request to the server has failed.',
					type: 'Please check your connection and try again later or contact the support if the problem persists',
				}];
			else if (e.error)
				this._extractMessagesFromApiErrorResponse(e.error);
		} else if (has(e, 'response')) {
			e = <IApiErrorResponse>e;
			this.status = e.response.code;
			this.statusText = get(STATUS_CODE_MESSAGES, this.status);
			this._extractMessagesFromApiErrorResponse(e);
		} else
			assign(this, e);

		this.messages.forEach(it => it.field = camelCase(it.field));
	}

	private _extractMessagesFromApiErrorResponse(e: IApiErrorResponse) {
		this.messages = e.result
			? isArray(e.result) ? e.result : [e.result]
			: e.response && e.response.message && [{ message: lowerCase(e.response.message) }] || [];
	}
}

export interface IApiErrorResponse {

	response: {
		status: string,
		code: number,
		message: string
	};

	result?: IApiErrorMessage | IApiErrorMessage[];
}

export interface IApiErrorMessage {

	message: string;

	type?: string;

	field?: string;

}
