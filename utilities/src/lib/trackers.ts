export function idTracker(index: number, item: { id: string | number }) {
	if (!item.hasOwnProperty('id'))
		throw new Error('The Id Tracker requires on the item to have the id property');
	return item.id;
}
