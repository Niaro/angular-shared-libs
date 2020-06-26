import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { DeleteConfirmDialogComponent } from './delete-confirm-dialog';
import { DiscardChangesConfirmDialogComponent } from './discard-changes-confirm-dialog';
import { LogoutConfirmDialogComponent } from './logout-confirm-dialog';

const EXPOSED_DIALOGS = [
	DeleteConfirmDialogComponent,
	DiscardChangesConfirmDialogComponent,
	LogoutConfirmDialogComponent
];

@NgModule({
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule
	],
	exports: EXPOSED_DIALOGS,
	declarations: EXPOSED_DIALOGS,
})
export class SharedComponentsDialogsModule { }
