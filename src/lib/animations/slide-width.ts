import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';

import { NORMAL } from './variables';

const slidedHorizontalIn = {
	width: 0,
	'margin-left': 0,
	'margin-right': 0,
	'padding-left': 0,
	'padding-right': 0,
	overflow: 'hidden',
};
export const SLIDE_HORIZONTAL_OUT_ANIMATION = animation(
	[
		style(slidedHorizontalIn),
		animate(
			'{{timing}}s {{ease}}',
			style({
				width: '*',
				'margin-left': '*',
				'margin-right': '*',
				'padding-left': '*',
				'padding-right': '*',
			})
		),
	],
	NORMAL
);

export const SLIDE_HORIZONTAL_IN_ANIMATION = animation(
	animate('{{timing}}s {{ease}}', style(slidedHorizontalIn)),
	NORMAL
);

export const SLIDE_HORIZONTAL = trigger('slideHorizontal', [
	transition(':enter', useAnimation(SLIDE_HORIZONTAL_OUT_ANIMATION)),
	transition(':leave', useAnimation(SLIDE_HORIZONTAL_IN_ANIMATION)),
]);
