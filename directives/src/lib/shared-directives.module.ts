import { NgModule } from '@angular/core';

import { DelayedRenderDirective } from './delayed-render.directive';
import { DisabledDirective } from './disabled.directive';
import { DynamicOutletDirective } from './dynamic-outlet.directive';
import { FeatureUnderDevelopmentDirective } from './feature-under-development.directive';
import { HoverDirective } from './hover.directive';
import {
	OutletLinkRelativeToTargetDirective, OutletLinkRelativeToTargetWithHrefDirective
} from './outlet-link-relative-to-target';
import { ProgressBarDirective } from './progress-bar.directive';
import { RouterLinkNoOutletsWithHrefDirective } from './router-link-no-outlets.directive';
import { SortDirective } from './sort.directive';
import { TargetBlankDirective } from './target-blank.directive';
import { TextMaskDirective } from './text-mask';

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
	FeatureUnderDevelopmentDirective
];

@NgModule({
	exports: EXPOSED_DIRECTIVES,
	declarations: EXPOSED_DIRECTIVES
})
export class SharedDirectivesModule { }
