import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { SharedFeaturesSelectModule } from '@bp/shared/features/select';
import { SharedFeaturesSvgIconsModule } from '@bp/shared/features/svg-icons';
import { SharedFeaturesTooltipModule } from '@bp/shared/features/tooltip';
import { SharedPipesModule } from '@bp/shared/pipes';

import { AlertComponent, AlertMessagesComponent, ApiErrorsComponent } from './alert';
import { BurgerBtnComponent, PendingBtnComponent, PendingIconBtnComponent } from './buttons';
import { CopyComponent } from './copy';
import { CountryComponent } from './country';
import { DatepickerCalendarHeaderComponent } from './datepicker-calendar-header';
import { FilterComponent, FilterControlDirective } from './filter';
import { HintComponent } from './hint';
import { ImgComponent } from './img';
import { CursorPageAdaptorDirective, PaginatorComponent } from './paginator';
import { PaymentMethodBrandComponent } from './payment-method-brand';
import { StatusBarComponent, StatusBarContainerDirective } from './status-bar';
import { ToastComponent } from './toast';
import { VersionComponent } from './version';

const EXPOSED_MODULES = [
	MatMomentDateModule
];

const EXPOSED_COMPONENTS = [
	AlertComponent,
	AlertMessagesComponent,
	ApiErrorsComponent,
	PaginatorComponent,
	StatusBarComponent,
	FilterControlDirective,
	FilterComponent,
	CopyComponent,
	CountryComponent,
	PaymentMethodBrandComponent,
	ImgComponent,
	VersionComponent,
	ToastComponent,
	DatepickerCalendarHeaderComponent,
	HintComponent,

	PendingIconBtnComponent,
	PendingBtnComponent,
	BurgerBtnComponent,
];

const EXPOSED_DIRECTIVES = [
	StatusBarContainerDirective,
	CursorPageAdaptorDirective
];

const EXPOSED = [
	EXPOSED_COMPONENTS,
	EXPOSED_DIRECTIVES
];

@NgModule({
	imports: [
		EXPOSED_MODULES,

		CommonModule,
		RouterModule,
		ToastrModule,

		MatButtonModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatRippleModule,

		SharedPipesModule,
		SharedFeaturesSvgIconsModule,
		SharedFeaturesSelectModule,
		SharedFeaturesTooltipModule
	],
	exports: [ EXPOSED, EXPOSED_MODULES ],
	declarations: EXPOSED,
})
export class SharedComponentsCoreModule {
	static forRoot(): ModuleWithProviders<SharedComponentsCoreModule> {
		return {
			ngModule: SharedComponentsCoreModule,
			providers: [
				ToastrModule.forRoot({
					toastComponent: ToastComponent,
					timeOut: 5000,
					preventDuplicates: true,
					closeButton: true,
					resetTimeoutOnDuplicate: true,
					maxOpened: 5,
					progressBar: true,
					onActivateTick: true
				}).providers!,
				{ provide: MAT_DATE_LOCALE, useValue: navigator.language || navigator.languages[ 0 ] },
				{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
			]
		};
	}
}
