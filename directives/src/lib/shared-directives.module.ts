import { NgModule } from '@angular/core';

import { TextMaskDirective } from './text-mask';
import { RouterLinkNoOutletsWithHrefDirective } from './router-link-no-outlets.directive';
import {
	OutletLinkRelativeToTargetDirective, OutletLinkRelativeToTargetWithHrefDirective
} from './outlet-link-relative-to-target';
import { TargetBlankDirective } from './target-blank.directive';
import { SortDirective } from './sort.directive';
import { DelayedRenderDirective } from './delayed-render.directive';
import { DynamicOutletDirective } from './dynamic-outlet.directive';
import { ProgressBarDirective } from './progress-bar.directive';
import { DisabledDirective } from './disabled.directive';
import { HoverDirective } from './hover.directive';

const EXPOSED_DIRECTIVES = [
	TextMaskDirective,
	RouterLinkNoOutletsWithHrefDirective,
	OutletLinkRelativeToTargetDirective,
	OutletLinkRelativeToTargetWithHrefDirective,
	TargetBlankDirective,
	SortDirective,
	DelayedRenderDirective,
	DynamicOutletDirective,
	ProgressBarDirective,
	DisabledDirective,
	HoverDirective,
];

@NgModule({
	exports: EXPOSED_DIRECTIVES,
	declarations: EXPOSED_DIRECTIVES
})
export class SharedDirectivesModule { }
