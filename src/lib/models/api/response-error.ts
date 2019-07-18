import { StatusCode, STATUS_CODE_MESSAGES } from './status-code';
import { HttpErrorResponse } from '@angular/common/http';
import { isArray, camelCase, lowerCase } from 'lodash-es';

export class ResponseError {
	status: StatusCode;

	statusText: string;

	messages: IApiErrorMessage[] = [];

	url: string;

	get isForbidden() {
		return this.status === StatusCode.forbidden;
	}

	get isInternalServerError() {
		return this.status === StatusCode.internalServerError;
	}

	constructor(e: HttpErrorResponse | Partial<ResponseError>) {
		this.url = e.url;
		this.status = e.status >= 500 || e.status === 0 || e['statusText'] === 'Unknown Error'
			? StatusCode.internalServerError
			: e.status === 0 ? StatusCode.timeout : e.status;

		this.statusText = this.statusText || STATUS_CODE_MESSAGES[this.status];

		if (this.status === StatusCode.notFound)
			return this;

		if (this.status === StatusCode.internalServerError)
			this.messages = [{
				message: 'The request to the server has failed.',
				type: 'Please check your connection and try again later or contact the support if the problem persists',
			}];
		else if (e instanceof HttpErrorResponse && e.error) {
			const result: IApiErrorMessage | IApiErrorMessage[] = e.error.result;
			this.messages = result
				? isArray(result) ? result : [result]
				: e.error.response && e.error.response.message && [{ message: lowerCase(e.error.response.message) }] || [];
		}

		this.messages.forEach(it => it.field = camelCase(it.field));
	}
}

export interface IApiErrorMessage {
	message: string;
	type?: string;
	field?: string;
}
