import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * The dialog will close with true if user clicks the ok button,
 * otherwise it will close with undefined.
 */
@Component({
	selector: 'bp-logout-confirm-dialog',
	templateUrl: './logout-confirm-dialog.component.html',
	styleUrls: [ './logout-confirm-dialog.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutConfirmDialogComponent { }
