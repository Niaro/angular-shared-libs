export class QueryParamsBase<T = any> {

	protected _routeParams!: Partial<Typify<T, string>>;

	constructor(routeParams: Partial<T>) {
		Object.defineProperty(this, '_routeParams', {
			enumerable: false, // by doing this the property becomes unserializable by JSON.stringify()
			value: routeParams
		});
	}
}
