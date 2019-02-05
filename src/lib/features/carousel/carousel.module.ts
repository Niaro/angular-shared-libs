import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material';

import { TouchModule } from '../touch';

import { CarouselComponent } from './carousel.component';

@NgModule({
	imports: [
		CommonModule,
		MatRippleModule,
		TouchModule],
	declarations: [CarouselComponent],
	exports: [CarouselComponent]
})
export class CarouselModule { }
