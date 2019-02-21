import { NgModule } from '@angular/core';

import {
	MatCardModule,
	MatInputModule,
	MatButtonModule,
	MatIconModule,
	MatToolbarModule,
	MatDialogModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatProgressBarModule,
	MatSnackBarModule,
	MatPaginatorModule,
	MatSortModule,
	MatSelectModule,
	MatRippleModule,
	MatTooltipModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MatSlideToggleModule
} from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

const MODULES = [
	MatCardModule,
	MatInputModule,
	MatButtonModule,
	MatIconModule,
	MatToolbarModule,
	MatProgressSpinnerModule,
	MatProgressBarModule,
	MatDialogModule,
	MatMenuModule,
	MatSnackBarModule,
	MatPaginatorModule,
	MatSortModule,
	MatSelectModule,
	MatRippleModule,
	MatTooltipModule,
	MatDatepickerModule,
	MatMomentDateModule,
	MatAutocompleteModule,
	MatSlideToggleModule
];

@NgModule({
	imports: MODULES,
	exports: MODULES,
})
export class MaterialModule {}
