import { Provider, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiRequestInterceptorService } from './api-request.interceptor.service';
import { ApiResponseInterceptorService } from './api-response.interceptor.service';
import { RouterService } from './router.service';
import { TelemetryService, AppErrorHandler } from './telemetry.service';
import { RxJSExtenderService } from './rxjs-extender.service';
import { EnvironmentService } from './environment.service';

export {
	RouterService, TelemetryService, ApiRequestInterceptorService as ApiDefaultsInterceptorService, RxJSExtenderService,
	EnvironmentService
};

export const PROVIDERS: Provider[] = [
	RouterService,
	TelemetryService,
	RxJSExtenderService,
	EnvironmentService,
	{ provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptorService, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: ApiRequestInterceptorService, multi: true },
	{ provide: ErrorHandler, useClass: AppErrorHandler },
];
