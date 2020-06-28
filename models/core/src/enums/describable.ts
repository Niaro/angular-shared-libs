import { Enumeration } from '@bp/shared/models/core/enum';

import { IDescribable } from '../interfaces';

export abstract class Describable extends Enumeration implements IDescribable {
	constructor(
		displayName?: string | null,
		// tslint:disable-next-line: parameter-properties
		public description?: string
	) {
		super(displayName);
	}
}
