import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'bp-discard-changes-confirm-dialog',
	templateUrl: './discard-changes-confirm-dialog.component.html',
	styleUrls: [ './discard-changes-confirm-dialog.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscardChangesConfirmDialogComponent { }
