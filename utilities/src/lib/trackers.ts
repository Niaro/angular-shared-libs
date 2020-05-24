export function idTracker<T extends Object>(index: number, item: T) {
	if (!item.hasOwnProperty('id'))
		throw new Error('The Id Tracker requires on the item to have the id property');
	return (<any> item).id;
}
