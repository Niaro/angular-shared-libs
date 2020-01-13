import { Entity } from '../models';

export function cloneAndSpliceById<T extends Entity>(collectionToClone: T[], itemToReplace: T): T[] {
	const clone = collectionToClone.slice();
	clone.splice(clone.findIndex(v => itemToReplace.id === v.id), 1, itemToReplace);
	return clone;
}
