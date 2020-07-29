export function cloneCollectionAndTryUpdateItemById<T extends { id: any; }>(
	collectionToClone: T[], itemToUpdate: T
): T[] {
	const shallowClone = collectionToClone.slice();

	const entityArrayIndex = shallowClone.findIndex(v => itemToUpdate.id === v.id);
	if (entityArrayIndex !== -1)
		shallowClone.splice(entityArrayIndex, 1, itemToUpdate);

	return shallowClone;
}
