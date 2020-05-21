export class Vector {

	get absDx() { return Math.abs(this.dx); }

	get absDy() { return Math.abs(this.dy); }

	constructor(public dx: number, public dy: number) { }

	length() {
		return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
	}

	getAngle(other: Vector) {
		const mr = this.length() * other.length();
		if (mr === 0) return 0;
		let r = this._dot(other) / mr;
		if (r > 1) r = 1;
		return Math.acos(r);
	}

	getAngleDegree(other: Vector) {
		let angle = this.getAngle(other);
		if (this._cross(other) > 0)
			angle *= -1;

		return angle * 180 / Math.PI;
	}

	direction(): Direction {
		return this.absDx >= this.absDy
			? (this.dx > 0 ? Direction.Left : Direction.Right)
			: (this.dy > 0 ? Direction.Up : Direction.Down);
	}

	private _dot(other: Vector) {
		return this.dx * other.dx + this.dy * other.dy;
	}

	private _cross(other: Vector) {
		return this.dx * other.dy - this.dy * other.dx;
	}
}

export enum Direction {
	Left,
	Right,
	Up,
	Down
}
