import { Provider, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiRequestInterceptorService } from './api-request.interceptor.service';
import { ApiResponseInterceptorService } from './api-response.interceptor.service';
import { RouterService } from './router.service';
import { TelemetryService, AppErrorHandler } from './telemetry.service';
import { RxJSExtenderService } from './rxjs-extender.service';
import { EnvironmentService } from './environment.service';
import { FIREBASE_APP_ID, FirebaseService } from './firebase.service';

export {
	RouterService, TelemetryService, ApiRequestInterceptorService, RxJSExtenderService,
	EnvironmentService, FIREBASE_APP_ID, FirebaseService
};

export const PROVIDERS: Provider[] = [
	RouterService,
	TelemetryService,
	RxJSExtenderService,
	EnvironmentService,
	FirebaseService,
	{ provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptorService, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: ApiRequestInterceptorService, multi: true },
	{ provide: ErrorHandler, useClass: AppErrorHandler },
];
