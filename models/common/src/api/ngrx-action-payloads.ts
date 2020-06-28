import { PagedResults } from './paged-results';
import { ResponseError } from './response-error';

export type ApiResultActionPayload<T> = { result: T; };

export type ApiPagedResultActionPayload<T> = { result: PagedResults<T>; };

export type ApiErrorActionPayload = { apiError: ResponseError; };
