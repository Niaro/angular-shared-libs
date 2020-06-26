import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

import { SharedFeaturesTouchModule } from '@bp/shared/features/touch';

import { CarouselComponent } from './carousel.component';

@NgModule({
	imports: [
		CommonModule,
		MatRippleModule,
		SharedFeaturesTouchModule,
		DragDropModule
	],
	declarations: [ CarouselComponent ],
	exports: [ CarouselComponent ]
})
export class SharedFeaturesCarouselModule { }
