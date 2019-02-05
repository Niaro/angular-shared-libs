import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';

import { MaterialModule } from './materials.module';
import { PROVIDERS, RxJSExtenderService } from './providers';
import { FieldErrorComponent } from './validation';
import {
	AlertComponent, ApiErrorComponent, DateRangeComponent, InputComponent, PaginatorComponent,
	CountrySelectorComponent, IpInputComponent, StatusBarComponent, StatusBarContainerDirective,
	FilterComponent, FilterControlDirective, DatepickerCalendarHeaderComponent, SvgSharedIconsDefinitionsComponent,
	SvgIconComponent, ModalOutletComponent, ModalComponent
} from './components';
import { UpperFirstPipe, IsPresentPipe, LowerCasePipe, ToKeyValuePairsPipe, MomentPipe, SafePipe } from './pipes';
import { TextMaskDirective, TargetBlankDirective, SortDirective } from './directives';
import { APP_LOCAL_STORAGE_PREFIX } from './models';
import { TouchModule, CarouselModule } from './features';


const MODULES = [
	CommonModule,
	MaterialModule,
	RouterModule,
	ReactiveFormsModule,
	LocalStorageModule,

	TouchModule,
	CarouselModule
];

const EXPOSED = [
	// misc
	FieldErrorComponent,
	AlertComponent,
	ApiErrorComponent,
	PaginatorComponent,
	StatusBarComponent,
	FilterComponent,
	FilterControlDirective,
	SvgSharedIconsDefinitionsComponent,
	SvgIconComponent,
	ModalOutletComponent,
	ModalComponent,

	// directives
	TextMaskDirective,
	StatusBarContainerDirective,
	TargetBlankDirective,
	SortDirective,

	// controls
	DateRangeComponent,
	DatepickerCalendarHeaderComponent,
	InputComponent,
	CountrySelectorComponent,
	IpInputComponent,

	// pipes
	UpperFirstPipe,
	LowerCasePipe,
	IsPresentPipe,
	ToKeyValuePairsPipe,
	MomentPipe,
	SafePipe
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
				...LocalStorageModule.forRoot({
					prefix: APP_LOCAL_STORAGE_PREFIX,
					storageType: 'localStorage'
				}).providers,
				...PROVIDERS
			]
		};
	}

	constructor(rxjsExtender: RxJSExtenderService) { }
}
