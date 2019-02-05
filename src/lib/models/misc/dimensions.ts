import { isEqual } from 'lodash-es';

export class Size {
	constructor(public width: number, public height: number) { }
}

export interface IPosition {
	top?: number;
	left?: number;
	bottom?: number;
	right?: number;
}

export class Position {
	top: number;
	bottom: number;
	left: number;
	right: number;

	constructor(position?: Partial<Position>) {
		if (position) {
			this.top = position.top;
			this.bottom = position.bottom;
			this.left = position.left;
			this.right = position.right;
		}
	}

	equal(d: Position) {
		return isEqual(this, d);
	}
}

export class Dimensions extends Size implements IPosition {
	top = 0;
	left = 0;
	get bottom() { return this.top + this.height; }
	get right() { return this.left + this.width; }

	constructor(dimensions?: Partial<Dimensions>) {
		super(dimensions && dimensions.width || 0, dimensions && dimensions.height || 0);

		if (dimensions) {
			this.top = dimensions.top || 0;
			this.left = dimensions.left || 0;
		}
	}

	equal(d: Dimensions) {
		return isEqual(this, d);
	}
}
