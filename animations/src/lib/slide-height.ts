import { animate, animation, style, transition, trigger, useAnimation } from '@angular/animations';

import { NORMAL } from './variables';

const slidedUp = {
	height: 0,
	'margin-top': 0,
	'margin-bottom': 0,
	'padding-top': 0,
	'padding-bottom': 0,
	overflow: 'hidden',
};
export const SLIDE_DOWN_ANIMATION = animation(
	[
		style(slidedUp),
		animate(
			'{{timing}}s {{ease}}',
			style({
				height: '*',
				'margin-top': '*',
				'margin-bottom': '*',
				'padding-top': '*',
				'padding-bottom': '*',
			})
		),
	],
	NORMAL
);

export const SLIDE_UP_ANIMATION = animation(
	animate('{{timing}}s {{ease}}', style(slidedUp)),
	NORMAL
);

export const SLIDE = trigger('slide', [
	transition(':enter', useAnimation(SLIDE_DOWN_ANIMATION)),
	transition(':leave', useAnimation(SLIDE_UP_ANIMATION)),
]);

export const SLIDE_IN = trigger('slideIn', [
	transition(':enter', useAnimation(SLIDE_DOWN_ANIMATION)),
]);
