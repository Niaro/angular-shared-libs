import { Injectable } from '@angular/core';
import m from 'moment';

@Injectable({
	providedIn: 'root'
})
export class MomentService {

	init() {
		m.fn.toJSON = function () { return <string> <any> this.unix(); };
	}

}
