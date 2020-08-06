// The native one works differently
export function lineMicrotask(cb: () => void) {
	// deepcode ignore PromiseNotCaughtGeneral: <please specify a reason of ignoring this>
	Promise
		.resolve()
		.then(cb);
}
