import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeleteConfirmDialogData } from './delete-confirm-dialog-data';

@Component({
	selector: 'bp-delete-confirm-dialog',
	templateUrl: './delete-confirm-dialog.component.html',
	styleUrls: [ './delete-confirm-dialog.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmDialogComponent {

	constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteConfirmDialogData) { }

}
