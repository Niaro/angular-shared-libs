export function cloneCollectionAndTryUpdateItemById<T extends { id: any; }>(
	collectionToClone: T[], itemToUpdate: T
): T[] {
	const clone = collectionToClone.slice();

	const entityArrayIndex = clone.findIndex(v => itemToUpdate.id === v.id);
	if (entityArrayIndex !== -1)
		clone.splice(entityArrayIndex, 1, itemToUpdate);

	return clone;
}
