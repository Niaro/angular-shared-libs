import { NgModule } from '@angular/core';

import {
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatSidenavModule,
	MatListModule,
	MatIconModule,
	MatToolbarModule,
	MatProgressSpinnerModule,
	MatDialogModule,
	MatGridListModule,
	MatMenuModule,
	MatProgressBarModule,
} from '@angular/material';

const MODULES = [
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatSidenavModule,
	MatListModule,
	MatIconModule,
	MatToolbarModule,
	MatProgressSpinnerModule,
	MatProgressBarModule,
	MatDialogModule,
	MatGridListModule,
	MatMenuModule,
];

@NgModule({
	imports: MODULES,
	exports: MODULES,
})
export class MaterialModule {}
