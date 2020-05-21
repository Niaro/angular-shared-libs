
import { NgModule } from '@angular/core';

import { TouchDirective } from './touch.directive';

@NgModule({
	exports: [ TouchDirective ],
	declarations: [ TouchDirective ]
})
export class SharedFeaturesTouchModule { }
