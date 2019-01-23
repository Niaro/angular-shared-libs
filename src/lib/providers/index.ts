import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiDefaultsInterceptorService } from './api-defaults.interceptor.service';
import { ApiResponseInterceptorService } from './api-response.interceptor.service';
import { SwUpdatesService } from './sw-update.service';
import { RouterService } from './router.service';
import { TelemetryService } from './telemetry.service';

export { SwUpdatesService, RouterService, TelemetryService };

export const PROVIDERS: Provider[] = [
	SwUpdatesService,
	RouterService,
	TelemetryService,
	{ provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptorService, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: ApiDefaultsInterceptorService, multi: true }
];
