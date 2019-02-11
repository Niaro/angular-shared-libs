import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
	hasOpenedDialogs$ = merge(
		this.dialog.afterOpen.pipe(map(() => true)),
		this.dialog.afterAllClosed.pipe(map(() => false)),
	);

	constructor(private dialog: MatDialog) { }
}
