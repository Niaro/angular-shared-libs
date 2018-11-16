import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';

import { MaterialModule } from './materials.module';
import { LayoutModule } from './layout';
import { PROVIDERS, AppUpdateService } from './providers';
import { FieldErrorComponent } from './validation';
import { AlertComponent, ApiErrorComponent } from './components';

const MODULES = [CommonModule, MaterialModule, RouterModule, LayoutModule];

const EXPOSED = [
	FieldErrorComponent,
	AlertComponent,
	ApiErrorComponent
];

@NgModule({
	imports: [
		...MODULES,
		LocalStorageModule.withConfig({
			prefix: '[bridgerpay]',
			storageType: 'localStorage',
		}),
	],
	exports: [...EXPOSED, ...MODULES, LocalStorageModule],
	declarations: EXPOSED,
	providers: PROVIDERS,
})
export class SharedModule {
	constructor(update: AppUpdateService) {}
}
