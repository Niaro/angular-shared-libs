import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { SharedComponentsCoreModule } from '@bp/shared/components/core';
import { SharedDirectivesModule } from '@bp/shared/directives';
import { SharedFeaturesSelectModule } from '@bp/shared/features/select';
import { SharedFeaturesValidationModule } from '@bp/shared/features/validation';
import { SharedPipesModule } from '@bp/shared/pipes';

import { AutocompleteComponent } from './autocomplete';
import { ButtonToggleComponent } from './button-toggle';
import { ChipsControlComponent } from './chips';
import { CountrySelectorComponent } from './country-selector';
import { DateRangeComponent } from './date-range';
import { DateRangeShortcutsComponent } from './date-range-shortcuts';
import { DatePickerComponent } from './datepicker';
import { ImgUploadBtnComponent } from './img-upload-btn';
import { InputComponent, InputHintDirective, InputLabelDirective, InputPrefixDirective } from './input';
import { IpInputComponent } from './ip-input';
import { RoundInputComponent } from './round-input';
import { SelectComponent } from './select-field';

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
