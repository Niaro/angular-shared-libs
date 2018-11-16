import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiDefaultsInterceptorService } from './api-defaults.interceptor.service';
import { ApiResponseInterceptorService } from './api-response.interceptor.service';
import { AppUpdateService } from './app-update.service';

export { ApiDefaultsInterceptorService, AppUpdateService };

export const PROVIDERS: Provider[] = [
	AppUpdateService,
	{ provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptorService, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: ApiDefaultsInterceptorService, multi: true },
];
