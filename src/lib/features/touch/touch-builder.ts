import { Injectable, NgZone } from '@angular/core';
import { isString } from 'lodash-es';

import { TouchManager } from './touch-manager';

@Injectable()
export class TouchBuilder {

	constructor(private zone: NgZone) { }

	build(elementOrSelector: string | Element): TouchManager | null {
		const $element = isString(elementOrSelector) ? document.querySelector(elementOrSelector) : elementOrSelector;
		return $element && new TouchManager($element, this.zone);
	}
}
