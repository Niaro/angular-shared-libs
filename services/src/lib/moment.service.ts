import m from 'moment';

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class MomentService {

	init() {
		m.fn.toJSON = function() { return <string> <any> this.unix(); };
	}

}
