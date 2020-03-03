import { Entity } from '../models';

export function cloneAndSpliceById<T extends Entity>(collectionToClone: T[], itemToReplace: T): T[] {
	const clone = collectionToClone.slice();

	const entityArrayIndex = clone.findIndex(v => itemToReplace.id === v.id);
	if (entityArrayIndex === -1)
		clone.push(itemToReplace);
	else
		clone.splice(entityArrayIndex, 1, itemToReplace);

	return clone;
}
