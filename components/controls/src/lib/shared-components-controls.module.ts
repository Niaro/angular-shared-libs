import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { SharedComponentsCoreModule } from '@bp/shared/components/core';
import { SharedPipesModule } from '@bp/shared/pipes';
import { SharedDirectivesModule } from '@bp/shared/directives';
import { SharedFeaturesValidationModule } from '@bp/shared/features/validation';
import { SharedFeaturesSelectModule } from '@bp/shared/features/select';

import { DateRangeComponent } from './date-range';
import { DateRangeShortcutsComponent } from './date-range-shortcuts';
import { InputComponent, InputHintDirective, InputLabelDirective, InputPrefixDirective } from './input';
import { CountrySelectorComponent } from './country-selector';
import { IpInputComponent } from './ip-input';
import { DatePickerComponent } from './datepicker';
import { AutocompleteComponent } from './autocomplete';
import { SelectComponent } from './select-field';
import { RoundInputComponent } from './round-input';
import { ButtonToggleComponent } from './button-toggle';
import { ChipsControlComponent } from './chips';
import { ImgUploadBtnComponent } from './img-upload-btn';

const EXPOSED_COMPONENTS = [
	DateRangeComponent,
	DateRangeShortcutsComponent,
	InputHintDirective,
	InputComponent,
	InputLabelDirective,
	InputPrefixDirective,
	CountrySelectorComponent,
	IpInputComponent,
	DatePickerComponent,
	AutocompleteComponent,
	RoundInputComponent,
	SelectComponent,
	ButtonToggleComponent,
	ChipsControlComponent,
	ImgUploadBtnComponent
];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatFormFieldModule,
		MatInputModule,
		MatChipsModule,
		MatDatepickerModule,
		MatProgressBarModule,

		SharedPipesModule,
		SharedDirectivesModule,
		SharedComponentsCoreModule,
		SharedFeaturesSelectModule,
		SharedFeaturesValidationModule
	],
	exports: EXPOSED_COMPONENTS,
	declarations: EXPOSED_COMPONENTS
})
export class SharedComponentsControlsModule { }
