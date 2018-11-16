export enum StatusCode {
	noConnection = 0,
	ok = 200,
	created = 201,
	noContent = 204,
	badRequest = 400,
	unauthorized = 401,
	transactionDeclined = 402,
	forbidden = 403,
	notFound = 404,
	timeout = 408,
	conflict = 409,
	internalServerError = 500,
	gatewayTimeout = 504,
}

export const STATUS_CODE_MESSAGES = {
	[StatusCode.badRequest]: 'Bad request',
	[StatusCode.unauthorized]: 'Unauthorized',
	[StatusCode.transactionDeclined]: 'Transaction declined',
	[StatusCode.forbidden]: 'Access forbidden',
	[StatusCode.notFound]: 'Not found',
	[StatusCode.timeout]: 'The operation has timed out',
	get [StatusCode.gatewayTimeout]() { return this[StatusCode.timeout]; },
	[StatusCode.internalServerError]: 'Something is wrong!',
};
