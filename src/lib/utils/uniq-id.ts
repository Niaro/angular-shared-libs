export function uniqId(prefix: string, length = 10) {
	const hash = Math.random().toString(36).substr(2, length);
	return (prefix ? `${prefix}_` : '') + hash;
}
