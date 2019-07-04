import { NgModule, ModuleWithProviders } from '@angular/core';

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
	MatSlideToggleModule,
	MAT_SNACK_BAR_DEFAULT_OPTIONS,

} from '@angular/material';

import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

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
export class MaterialModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: MaterialModule,
			providers: [
				{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
				{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } }
			]
		};
	}
}
