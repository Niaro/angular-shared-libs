export enum StatusCode {
	NoConnection = 0,
	Ok = 200,
	Created = 201,
	NoContent = 204,
	Redirect = 302,
	BadRequest = 400,
	Unauthorized = 401,
	TransactionDeclined = 402,
	Forbidden = 403,
	NotFound = 404,
	Timeout = 408,
	Conflict = 409,
	InternalServerError = 500,
	GatewayTimeout = 504,
}

export const STATUS_CODE_MESSAGES = {
	[ StatusCode.BadRequest ]: 'Bad request',
	[ StatusCode.Unauthorized ]: 'Unauthorized',
	[ StatusCode.TransactionDeclined ]: 'Transaction declined',
	[ StatusCode.Forbidden ]: 'Access forbidden',
	[ StatusCode.NotFound ]: 'Not found',
	[ StatusCode.Timeout ]: 'The operation has timed out',
	get [ StatusCode.GatewayTimeout ]() { return this[ StatusCode.Timeout ]; },
	[ StatusCode.InternalServerError ]: 'Something is wrong!',
};
