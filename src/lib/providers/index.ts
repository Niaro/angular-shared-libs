import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiDefaultsInterceptorService } from './api-defaults.interceptor.service';
import { ApiResponseInterceptorService } from './api-response.interceptor.service';
import { SwUpdatesService } from './sw-update.service';

export { ApiDefaultsInterceptorService, SwUpdatesService };

export const PROVIDERS: Provider[] = [
	SwUpdatesService,
	{ provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptorService, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: ApiDefaultsInterceptorService, multi: true }
];
