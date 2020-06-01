import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';

import { FieldErrorComponent } from './field-error';
import { ValidationErrorComponent } from './validation-error';
import { DirtyAndInvalidErrorStateMatcher } from './dirty-and-invalid-error-state-matcher';

const EXPOSED_COMPONENTS = [
	FieldErrorComponent,
	ValidationErrorComponent
];

@NgModule({
	imports: [ CommonModule ],
	exports: EXPOSED_COMPONENTS,
	declarations: EXPOSED_COMPONENTS
})
export class SharedFeaturesValidationModule {
	static forRoot(): ModuleWithProviders<SharedFeaturesValidationModule> {
		return {
			ngModule: SharedFeaturesValidationModule,
			providers: [
				{ provide: ErrorStateMatcher, useClass: DirtyAndInvalidErrorStateMatcher },
			]
		};
	}
}
