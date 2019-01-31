export * from './touch';

import { NgModule } from '@angular/core';
import { RentCoreModule } from '../../core';
import { TouchDirective } from './touch.directive';
import { TouchBuilder } from './touch';

@NgModule({
	imports: [RentCoreModule],
	exports: [TouchDirective],
	declarations: [TouchDirective],
	providers: [TouchBuilder]
})
export class TouchModule { }