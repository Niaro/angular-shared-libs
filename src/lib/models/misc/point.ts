import { Vector } from './vector';

export class Point {
	constructor(public x: number, public y: number) { }

	diff(other: Point) {
		return new Vector(other.x - this.x, other.y - this.y);
	}
}
