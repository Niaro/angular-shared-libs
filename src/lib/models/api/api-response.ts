export interface IApiResponse<T> {
	response: {
		status: 'success' | 'error';
		code: number;
		message: string;
	};

	result: T;
}
