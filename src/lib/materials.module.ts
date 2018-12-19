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
	MatSnackBarModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatSelectModule,
	MatRippleModule,
	MatTooltipModule,
	MatDatepickerModule,
	MatAutocompleteModule
} from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

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
	MatSnackBarModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatSelectModule,
	MatRippleModule,
	MatTooltipModule,
	MatDatepickerModule,
	MatMomentDateModule,
	MatAutocompleteModule
];

@NgModule({
	imports: MODULES,
	exports: MODULES,
})
export class MaterialModule {}
