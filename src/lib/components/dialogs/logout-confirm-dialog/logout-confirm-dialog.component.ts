import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'bp-logout-confirm-dialog',
	templateUrl: './logout-confirm-dialog.component.html',
	styleUrls: [ './logout-confirm-dialog.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutConfirmDialogComponent { }
