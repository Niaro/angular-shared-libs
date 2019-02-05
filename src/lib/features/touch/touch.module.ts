

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TouchDirective } from './touch.directive';
import { TouchBuilder } from './touch-builder';

@NgModule({
	imports: [CommonModule],
	exports: [TouchDirective],
	declarations: [TouchDirective],
	providers: [TouchBuilder]
})
export class TouchModule { }
