
import { LocalStorageModule } from 'angular-2-local-storage';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';

import { APP_LOCAL_STORAGE_PREFIX } from '@bp/shared/models/core';

import { HttpRequestInterceptorService, HttpResponseInterceptorService } from './http';
import { AppErrorHandler } from './telemetry';

const EXPOSED_MODULES = [
	LocalStorageModule
];

@NgModule({
	imports: EXPOSED_MODULES,
	exports: EXPOSED_MODULES
})
export class SharedServicesModule {

	static forRoot(): ModuleWithProviders<SharedServicesModule> {
		return {
			ngModule: SharedServicesModule,
			providers: [
				LocalStorageModule.forRoot({
					prefix: APP_LOCAL_STORAGE_PREFIX,
					storageType: 'localStorage'
				}).providers!,
				{ provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptorService, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptorService, multi: true },
				{ provide: ErrorHandler, useClass: AppErrorHandler },
			]
		};
	}

}
