export function uniqId(prefix: string, length = 20) {
	const hash = Math.random().toString(36).substr(2, length);
	return (prefix ? `${prefix}` : '') + hash;
}
