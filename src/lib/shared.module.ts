import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';

import { MaterialModule } from './materials.module';
import { LayoutModule } from './layout/layout.module';
import { PROVIDERS, SwUpdatesService } from './providers';
import { FieldErrorComponent } from './validation';
import { AlertComponent, ApiErrorComponent } from './components';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { APP_STATE_PREFIX } from './state';

const MODULES = [CommonModule, MaterialModule, RouterModule, LayoutModule];

const EXPOSED = [FieldErrorComponent, AlertComponent, ApiErrorComponent, PaginatorComponent];

@NgModule({
	imports: [
		...MODULES,
		LocalStorageModule.withConfig({
			prefix: APP_STATE_PREFIX,
			storageType: 'localStorage'
		})
	],
	exports: [...EXPOSED, ...MODULES, LocalStorageModule],
	declarations: EXPOSED,
	providers: PROVIDERS
})
export class SharedModule {
	constructor(update: SwUpdatesService) {}
}
