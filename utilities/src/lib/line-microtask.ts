// The native one works differently
export function lineMicrotask(cb: () => void) {
	Promise
		.resolve()
		.then(cb);
}
