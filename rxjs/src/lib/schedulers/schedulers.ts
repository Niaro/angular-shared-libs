import { asyncOutside } from './async-outside-angular.scheduler';
import { outside } from './outside-angular.scheduler';
import { inside } from './inside-angular.scheduler';

export class BpScheduler {

	static asyncOutside = asyncOutside;

	static outside = outside;

	static inside = inside;

}
