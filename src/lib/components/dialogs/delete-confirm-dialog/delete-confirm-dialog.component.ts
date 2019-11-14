import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export type DeleteConfirmDialogData = {
	type: string,
	name: string,
};

/**
 * The dialog will close with true if user clicks the ok button,
 * otherwise it will close with undefined.
 */
@Component({
	selector: 'bp-delete-confirm-dialog',
	templateUrl: './delete-confirm-dialog.component.html',
	styleUrls: ['./delete-confirm-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmDialogComponent {

	constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteConfirmDialogData) { }

}
