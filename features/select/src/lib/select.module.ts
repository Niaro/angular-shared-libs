import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BpSelectComponent, BpSelectTrigger, BP_SELECT_SCROLL_STRATEGY_PROVIDER } from './select.component';

@NgModule({
	imports: [
		CommonModule,
		OverlayModule,
		MatOptionModule,
		MatCommonModule,
		MatSelectModule
	],
	exports: [
		MatFormFieldModule,
		BpSelectComponent,
		BpSelectTrigger,
		MatOptionModule,
		MatCommonModule
	],
	declarations: [
		BpSelectComponent,
		BpSelectTrigger
	],
	providers: [ BP_SELECT_SCROLL_STRATEGY_PROVIDER ]
})
export class SharedFeaturesSelectModule { }
