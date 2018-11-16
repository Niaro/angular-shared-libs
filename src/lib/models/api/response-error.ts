import { StatusCode, STATUS_CODE_MESSAGES } from './status-code';
import { HttpErrorResponse } from '@angular/common/http';
import { isArray } from 'lodash-es';

export class ResponseError {
	status: StatusCode;
	statusText: string;
	messages: IApiErrorMessage[];

	get isForbidden() {
		return this.status === StatusCode.forbidden;
	}

	constructor(e: HttpErrorResponse) {
		console.warn('error', e);
		this.status = e.status >= 500 || e.statusText === 'Unknown Error'
			? StatusCode.internalServerError
			: e.status === 0 ? StatusCode.timeout : e.status;

		this.status = e.status === StatusCode.gatewayTimeout
			? StatusCode.gatewayTimeout
			: this.status;

		this.statusText = STATUS_CODE_MESSAGES[this.status];

		if (this.status === StatusCode.notFound)
			return this;

		if (this.status === StatusCode.internalServerError)
			this.messages = [
				{
					message: 'We are sorry! The server has encountered an internal error and was unable to complete your request.',
					type: 'Try again a little later or contact the support if the problem persists',
				},
			];
		else if (this.status === StatusCode.gatewayTimeout)
			this.messages = [
				{
					message: this.statusText,
					type: 'Please, check your internet connection'
				}
			];
		else {
			const result: IApiErrorMessage | IApiErrorMessage[] = e.error.result;
			this.messages = result ? (isArray(result) ? result : [result]) : [];
		}
	}
}

export interface IApiErrorMessage {
	type: string;
	message: string;
	field?: string;
}
