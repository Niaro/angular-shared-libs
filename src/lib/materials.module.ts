import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

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
	MatSlideToggleModule,
	MatButtonToggleModule,
	MatChipsModule,
];

@NgModule({
	imports: MODULES,
	exports: MODULES
})
export class MaterialModule {
	static forRoot(): ModuleWithProviders<MaterialModule> {
		return {
			ngModule: MaterialModule,
			providers: [
				{ provide: MAT_DATE_LOCALE, useValue: navigator.language || navigator.languages[ 0 ] },
				{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
				{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } }
			]
		};
	}
}
