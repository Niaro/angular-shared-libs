
import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { APP_LOCAL_STORAGE_PREFIX } from '@bp/shared/models/core';

import { HttpResponseInterceptorService, HttpRequestInterceptorService } from './http';
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
