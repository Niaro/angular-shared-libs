export function lineMicrotask(cb: () => void) {
	return Promise.resolve().then(() => cb());
}
