import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
