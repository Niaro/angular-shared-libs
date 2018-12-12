import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';

import { MaterialModule } from './materials.module';
import { LayoutModule, IdentityModule } from './features';
import { PROVIDERS, SwUpdatesService } from './providers';
import { FieldErrorComponent } from './validation';
import { AlertComponent, ApiErrorComponent, DateRangeComponent, InputComponent, PaginatorComponent, CountryComponent, CreditCardComponent } from './components';
import { StoreModule } from '@ngrx/store';
import { APP_STATE_PREFIX } from './state';
import { UpperFirstPipe, IsPresentPipe, LowerCasePipe, ToKeyValuePairsPipe, MomentPipe } from './pipes';

const MODULES = [
	CommonModule,
	MaterialModule,
	RouterModule,
	StoreModule,
	LocalStorageModule,
	LayoutModule,
	IdentityModule
];

const EXPOSED = [
	// misc
	FieldErrorComponent,
	AlertComponent,
	ApiErrorComponent,
	PaginatorComponent,

	// controls
	DateRangeComponent,
	InputComponent,

	// business
	CountryComponent,
	CreditCardComponent,

	// pipes
	UpperFirstPipe,
	LowerCasePipe,
	IsPresentPipe,
	ToKeyValuePairsPipe,
	MomentPipe
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
