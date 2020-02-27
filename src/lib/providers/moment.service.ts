import { Injectable } from '@angular/core';
import * as m from 'moment';

@Injectable({
	providedIn: 'root'
})
export class MomentService {

	ignite() {
		m.fn.toJSON = function() { return <string> <any> this.unix(); };
	}

}
