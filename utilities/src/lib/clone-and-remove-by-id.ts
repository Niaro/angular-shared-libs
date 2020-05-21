export function cloneAndRemoveById<T extends { id: any; }>(collectionToClone: T[], itemToRemove: T): T[] {
	const clone = collectionToClone.slice();

	const entityArrayIndex = clone.findIndex(v => itemToRemove.id === v.id);
	if (entityArrayIndex !== -1)
		clone.splice(entityArrayIndex, 1);

	return clone;
}
