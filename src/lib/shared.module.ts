import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { QuicklinkModule } from 'ngx-quicklink';
import { ToastrModule } from 'ngx-toastr';

import { MaterialModule } from './materials.module';
import { FieldErrorComponent, ValidationErrorComponent } from './validation';

import {
	AlertComponent, ApiErrorsComponent, DateRangeComponent, InputComponent, PaginatorComponent,
	CountrySelectorComponent, IpInputComponent, StatusBarComponent, StatusBarContainerDirective,
	FilterComponent, FilterControlDirective, DatepickerCalendarHeaderComponent, DatePickerComponent,
	CopyComponent, CountryComponent, PendingBtnComponent, IconBtnComponent, DateRangeShortcutsComponent,
	AlertMessagesComponent, CursorPageAdaptorDirective, AutocompleteComponent, RoundInputComponent,
	PropertyMetadataControlComponent, SelectComponent, ButtonToggleComponent, PropertyMetadataViewComponent,
	DeleteConfirmDialogComponent, LogoutConfirmDialogComponent, PropertyMetadataViewsSectionComponent,
	PaymentMethodBrandComponent, PropertyMetadataControlsSectionComponent, ChipsControlComponent,
	ImgUploadBtnComponent, ImgComponent, InputHintDirective, InputLabelDirective, VersionComponent,
	InputPrefixDirective, ToastComponent
} from './components';

import {
	UpperFirstPipe, IsPresentPipe, LowerCasePipe, ToKeyValuePairsPipe, MomentPipe, SafePipe, ChunkPipe,
	StartCasePipe, TakePipe, PropertiesMetadataColspanPipe, BpCurrencyPipe
} from './pipes';

import {
	TextMaskDirective, TargetBlankDirective, SortDirective, RouterLinkNoOutletsWithHrefDirective,
	DelayedRenderDirective, DynamicOutletDirective, RouterLinkRootOutletsWithHrefDirective,
	RouterLinkRootOutletsDirective, ProgressBarDirective, DisabledDirective
} from './directives';

import { APP_LOCAL_STORAGE_PREFIX } from './models';

import { TouchModule, CarouselModule, SvgIconsModule, ModalModule, BpSelectModule } from './features';

import {
	RouterService, TelemetryService, ZoneService, EnvironmentService, FirebaseService, FileLoaderService,
	ApiResponseInterceptorService, ApiRequestInterceptorService, AppErrorHandler, TitleService
} from './providers';

const MODULES = [
	CommonModule,
	MaterialModule,
	RouterModule,
	ReactiveFormsModule,
	LocalStorageModule,
	QuicklinkModule,
	ToastrModule,

	TouchModule,
	CarouselModule,
	ModalModule,
	SvgIconsModule,
	BpSelectModule
];

const EXPOSED = [
	// misc
	ValidationErrorComponent,
	FieldErrorComponent,
	AlertComponent,
	AlertMessagesComponent,
	ApiErrorsComponent,
	PaginatorComponent,
	StatusBarComponent,
	FilterComponent,
	FilterControlDirective,
	PendingBtnComponent,
	CopyComponent,
	CountryComponent,
	IconBtnComponent,
	DeleteConfirmDialogComponent,
	LogoutConfirmDialogComponent,
	PaymentMethodBrandComponent,
	ImgComponent,
	VersionComponent,
	ToastComponent,

	// directives
	CursorPageAdaptorDirective,
	TextMaskDirective,
	RouterLinkNoOutletsWithHrefDirective,
	RouterLinkRootOutletsWithHrefDirective,
	RouterLinkRootOutletsDirective,
	StatusBarContainerDirective,
	TargetBlankDirective,
	SortDirective,
	DelayedRenderDirective,
	DynamicOutletDirective,
	ProgressBarDirective,
	DisabledDirective,

	// controls
	DateRangeComponent,
	DateRangeShortcutsComponent,
	DatepickerCalendarHeaderComponent,
	InputComponent,
	InputHintDirective,
	InputLabelDirective,
	InputPrefixDirective,
	CountrySelectorComponent,
	IpInputComponent,
	DatePickerComponent,
	AutocompleteComponent,
	RoundInputComponent,
	SelectComponent,
	ButtonToggleComponent,
	ChipsControlComponent,
	ImgUploadBtnComponent,
	PropertyMetadataControlComponent,
	PropertyMetadataControlsSectionComponent,
	PropertyMetadataViewComponent,
	PropertyMetadataViewsSectionComponent,

	// pipes
	UpperFirstPipe,
	LowerCasePipe,
	IsPresentPipe,
	ToKeyValuePairsPipe,
	MomentPipe,
	SafePipe,
	ChunkPipe,
	StartCasePipe,
	TakePipe,
	PropertiesMetadataColspanPipe,
	BpCurrencyPipe
];

@NgModule({
	imports: MODULES,
	exports: [...EXPOSED, ...MODULES],
	declarations: EXPOSED,
	entryComponents: [
		ToastComponent,
		DatepickerCalendarHeaderComponent,
		DeleteConfirmDialogComponent,
		LogoutConfirmDialogComponent
	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				...(LocalStorageModule.forRoot({
					prefix: APP_LOCAL_STORAGE_PREFIX,
					storageType: 'localStorage'
				}).providers || []),
				...(ModalModule.forRoot().providers || []),
				...(MaterialModule.forRoot().providers || []),
				...(ToastrModule.forRoot({
					toastComponent: ToastComponent,
					timeOut: 5000,
					preventDuplicates: true,
					closeButton: true,
					resetTimeoutOnDuplicate: true,
					maxOpened: 5,
					progressBar: true
				}).providers || []),
				BpCurrencyPipe,
				RouterService,
				TelemetryService,
				ZoneService,
				EnvironmentService,
				FirebaseService,
				FileLoaderService,
				TitleService,
				{ provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptorService, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: ApiRequestInterceptorService, multi: true },
				{ provide: ErrorHandler, useClass: AppErrorHandler },
			]
		};
	}

	// we inject the service here in order to init the underlying services logic from the the very start
	constructor(rxjsExtender: ZoneService) { }
}
