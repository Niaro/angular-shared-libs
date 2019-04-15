import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageModule } from 'angular-2-local-storage';

import { MaterialModule } from './materials.module';
import { PROVIDERS, RxJSExtenderService } from './providers';
import { FieldErrorComponent, ValidationErrorComponent } from './validation';
import {
	AlertComponent, ApiErrorComponent, DateRangeComponent, InputComponent, PaginatorComponent,
	CountrySelectorComponent, IpInputComponent, StatusBarComponent, StatusBarContainerDirective,
	FilterComponent, FilterControlDirective, DatepickerCalendarHeaderComponent, DatePickerComponent, CopyComponent
} from './components';
import { UpperFirstPipe, IsPresentPipe, LowerCasePipe, ToKeyValuePairsPipe, MomentPipe, SafePipe, ChunkPipe } from './pipes';
import { TextMaskDirective, TargetBlankDirective, SortDirective, RouterLinkNoOutletsWithHrefDirective } from './directives';
import { APP_LOCAL_STORAGE_PREFIX } from './models';

import { TouchModule, CarouselModule, SvgIconsModule, ModalModule } from './features';
import { PendingBtnComponent } from './components/misc/pending-btn';

const MODULES = [
	CommonModule,
	MaterialModule,
	RouterModule,
	HttpClientModule,
	ReactiveFormsModule,
	LocalStorageModule,

	TouchModule,
	CarouselModule,
	ModalModule,
	SvgIconsModule
];

const EXPOSED = [
	// misc
	ValidationErrorComponent,
	FieldErrorComponent,
	AlertComponent,
	ApiErrorComponent,
	PaginatorComponent,
	StatusBarComponent,
	FilterComponent,
	FilterControlDirective,
	PendingBtnComponent,
	CopyComponent,

	// directives
	TextMaskDirective,
	RouterLinkNoOutletsWithHrefDirective,
	StatusBarContainerDirective,
	TargetBlankDirective,
	SortDirective,

	// controls
	DateRangeComponent,
	DatepickerCalendarHeaderComponent,
	InputComponent,
	CountrySelectorComponent,
	IpInputComponent,
	DatePickerComponent,

	// pipes
	UpperFirstPipe,
	LowerCasePipe,
	IsPresentPipe,
	ToKeyValuePairsPipe,
	MomentPipe,
	SafePipe,
	ChunkPipe
];

@NgModule({
	imports     : MODULES,
	exports     : [...EXPOSED, ...MODULES],
	declarations: EXPOSED,
	entryComponents: [DatepickerCalendarHeaderComponent]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				...LocalStorageModule.withConfig({
					prefix: APP_LOCAL_STORAGE_PREFIX,
					storageType: 'localStorage'
				}).providers,
				...ModalModule.forRoot().providers,
				...PROVIDERS
			]
		};
	}

	constructor(rxjsExtender: RxJSExtenderService) { }
}
