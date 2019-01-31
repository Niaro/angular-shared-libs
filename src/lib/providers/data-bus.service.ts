import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Psp } from '../models';

@Injectable({
	providedIn: 'root'
})
export class DataBusService {
	psps$ = new BehaviorSubject<Psp[]>([]);
}
