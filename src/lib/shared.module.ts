import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { StoreModule } from '@ngrx/store';

import { MaterialModule } from './materials.module';
import { LayoutModule, IdentityModule } from './features';
import { PROVIDERS, SwUpdatesService } from './providers';
import { FieldErrorComponent } from './validation';
import {
	AlertComponent, ApiErrorComponent, DateRangeComponent, InputComponent, PaginatorComponent, CountryComponent,
	PaymentMethodBrandComponent, CountrySelectorComponent, IpInputComponent, StatusBarComponent, StatusBarContainerDirective,
	FilterComponent, FilterControlDirective
} from './components';
import { APP_STATE_PREFIX } from './state';
import { UpperFirstPipe, IsPresentPipe, LowerCasePipe, ToKeyValuePairsPipe, MomentPipe, SafePipe } from './pipes';
import { TextMaskDirective, TargetBlankDirective, SortDirective } from './directives';

const MODULES = [
	CommonModule,
	MaterialModule,
	RouterModule,
	StoreModule,
	LocalStorageModule,
	ReactiveFormsModule,

	LayoutModule,
	IdentityModule
];

const EXPOSED = [
	// misc
	FieldErrorComponent,
	AlertComponent,
	ApiErrorComponent,
	PaginatorComponent,
	StatusBarComponent,
	FilterComponent,
	FilterControlDirective,

	// directives
	TextMaskDirective,
	StatusBarContainerDirective,
	TargetBlankDirective,
	SortDirective,

	// controls
	DateRangeComponent,
	InputComponent,
	CountrySelectorComponent,
	IpInputComponent,

	// business
	CountryComponent,
	PaymentMethodBrandComponent,

	// pipes
	UpperFirstPipe,
	LowerCasePipe,
	IsPresentPipe,
	ToKeyValuePairsPipe,
	MomentPipe,
	SafePipe
];

@NgModule({
	imports     : MODULES,
	exports     : [...EXPOSED, ...MODULES],
	declarations: EXPOSED
})
export class SharedModule {

	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				LocalStorageModule.withConfig({
					prefix: APP_STATE_PREFIX,
					storageType: 'localStorage'
				}).providers,
				LayoutModule.forRoot().providers,
				IdentityModule.forRoot().providers,
				...PROVIDERS,
			]
		};
	}

	constructor(swUpdater: SwUpdatesService) { }

}
