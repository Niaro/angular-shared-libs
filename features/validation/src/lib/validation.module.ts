import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';

import { DirtyAndInvalidErrorStateMatcher } from './dirty-and-invalid-error-state-matcher';
import { FieldErrorComponent } from './field-error';
import { ValidationErrorComponent } from './validation-error';

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
