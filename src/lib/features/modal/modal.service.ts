import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

	hasOpenedDialogs$ = merge(
		this._dialog.afterOpen.pipe(map(() => true)),
		this._dialog.afterAllClosed.pipe(map(() => false)),
	);

	constructor(private _dialog: MatDialog) { }

	closeAll() {
		this._dialog.closeAll();
	}

}
