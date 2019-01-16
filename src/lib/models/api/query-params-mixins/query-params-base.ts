export class QueryParamsBase<T = any> {
	protected routeParams: Partial<T>;

	constructor(routeParams: Partial<T>) {
		Object.defineProperty(this, 'routeParams', {
			enumerable: false, // by doing this the property becomes unserializable by JSON.stringify()
			value: routeParams
		});
	}
}
