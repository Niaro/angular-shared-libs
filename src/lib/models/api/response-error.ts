import { StatusCode, STATUS_CODE_MESSAGES } from './status-code';
import { HttpErrorResponse } from '@angular/common/http';
import { isArray, camelCase, lowerCase, get, isString } from 'lodash-es';

export class ResponseError {
	static get notFound() {
		return new ResponseError({ status: StatusCode.notFound });
	}

	status?: StatusCode;

	statusText?: string;

	messages: IApiErrorMessage[] = [];

	url?: string | null;

	get isForbidden() {
		return this.status === StatusCode.forbidden;
	}

	get isInternalServerError() {
		return this.status === StatusCode.internalServerError;
	}

	constructor(e: HttpErrorResponse | DeepPartial<ResponseError> | string) {
		if (isString(e))
			this.messages = [{ message: e }];
		else {
			this.url = e.url;
			this.status = e.status! >= 500 || e.status === 0 || e['statusText'] === 'Unknown Error'
				? StatusCode.internalServerError
				: e.status!;

			this.statusText = this.statusText || get(STATUS_CODE_MESSAGES, this.status);

			if (this.status === StatusCode.notFound)
				this.messages = [{
					message: 'The resource has not been found',
				}];
			else if (this.status === StatusCode.internalServerError)
				this.messages = [{
					message: 'The request to the server has failed.',
					type: 'Please check your connection and try again later or contact the support if the problem persists',
				}];
			else if (e instanceof HttpErrorResponse && e.error) {
				const result: IApiErrorMessage | IApiErrorMessage[] = e.error.result;
				this.messages = result
					? isArray(result) ? result : [result]
					: e.error.response && e.error.response.message && [{ message: lowerCase(e.error.response.message) }] || [];
			} else
				this.messages = (<ResponseError>e).messages || [];
		}

		this.messages.forEach(it => it.field = camelCase(it.field));
	}
}

export interface IApiErrorMessage {
	message: string;
	type?: string;
	field?: string;
}
