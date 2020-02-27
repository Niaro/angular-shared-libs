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
	InputPrefixDirective, ToastComponent, DiscardChangesConfirmDialogComponent
} from './components';

import {
	UpperFirstPipe, IsPresentPipe, LowerCasePipe, ToKeyValuePairsPipe, MomentPipe, SafePipe, ChunkPipe,
	StartCasePipe, TakePipe, PropertiesMetadataColspanPipe, BpCurrencyPipe, SumByPipe
} from './pipes';

import {
	TextMaskDirective, TargetBlankDirective, SortDirective, RouterLinkNoOutletsWithHrefDirective,
	DelayedRenderDirective, DynamicOutletDirective, ProgressBarDirective, DisabledDirective,
	HoverDirective, OutletLinkRelativeToTargetDirective, OutletLinkRelativeToTargetWithHrefDirective
} from './directives';

import { APP_LOCAL_STORAGE_PREFIX } from './models';

import { TouchModule, CarouselModule, SvgIconsModule, ModalModule, BpSelectModule } from './features';

import { ZoneService, ApiResponseInterceptorService, ApiRequestInterceptorService, AppErrorHandler } from './providers';

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
	DiscardChangesConfirmDialogComponent,
	PaymentMethodBrandComponent,
	ImgComponent,
	VersionComponent,
	ToastComponent,

	// directives
	CursorPageAdaptorDirective,
	TextMaskDirective,
	RouterLinkNoOutletsWithHrefDirective,
	OutletLinkRelativeToTargetDirective,
	OutletLinkRelativeToTargetWithHrefDirective,
	StatusBarContainerDirective,
	TargetBlankDirective,
	SortDirective,
	DelayedRenderDirective,
	DynamicOutletDirective,
	ProgressBarDirective,
	DisabledDirective,
	HoverDirective,

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
	BpCurrencyPipe,
	SumByPipe
];

@NgModule({
	imports: MODULES,
	exports: [ ...EXPOSED, ...MODULES ],
	declarations: EXPOSED
})
export class SharedModule {
	static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [
				MaterialModule.forRoot().providers!,
				LocalStorageModule.forRoot({
					prefix: APP_LOCAL_STORAGE_PREFIX,
					storageType: 'localStorage'
				}).providers!,
				ToastrModule.forRoot({
					toastComponent: ToastComponent,
					timeOut: 5000,
					preventDuplicates: true,
					closeButton: true,
					resetTimeoutOnDuplicate: true,
					maxOpened: 5,
					progressBar: true
				}).providers!,
				BpCurrencyPipe,
				{ provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptorService, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: ApiRequestInterceptorService, multi: true },
				{ provide: ErrorHandler, useClass: AppErrorHandler },
			]
		};
	}

	constructor(rxjsExtender: ZoneService) {
		rxjsExtender.ignite();
	}
}
