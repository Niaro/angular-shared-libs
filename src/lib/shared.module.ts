import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';

import { MaterialModule } from './materials.module';
import { LayoutModule } from './layout/layout.module';
import { PROVIDERS, SwUpdatesService } from './providers';
import { FieldErrorComponent } from './validation';
import { AlertComponent, ApiErrorComponent, DateRangeComponent, InputComponent, PaginatorComponent } from './components';
import { APP_STATE_PREFIX } from './state';
import { IdentityModule } from './identity';

const MODULES = [
	CommonModule,
	MaterialModule,
	RouterModule,
	LocalStorageModule,
	LayoutModule,
	IdentityModule
];

const EXPOSED = [
	FieldErrorComponent,
	AlertComponent,
	ApiErrorComponent,
	PaginatorComponent,
	DateRangeComponent,
	InputComponent
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
				...PROVIDERS,
				LocalStorageModule.withConfig({
					prefix: APP_STATE_PREFIX,
					storageType: 'localStorage'
				}).providers,
				LayoutModule.forRoot().providers,
				IdentityModule.forRoot().providers
			]
		};
	}

	constructor(swUpdater: SwUpdatesService) { }

}
