import { ResponseError } from './response-error';
import { PagedResults } from './paged-results';

export type ApiResultActionPayload<T> = { result: T; };

export type ApiPagedResultActionPayload<T> = { result: PagedResults<T>; };

export type ApiErrorActionPayload = { apiError: ResponseError; };
