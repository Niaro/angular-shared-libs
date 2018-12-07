import { transition, trigger, useAnimation, animation, style, animate } from '@angular/animations';
import { fadeIn, fadeOut, slideInUp, slideOutUp, slideInRight, slideOutRight } from 'ng-animate';

const EASE = 'cubic-bezier(0.390, 0.575, 0.565, 1.000)';
const FAST = { params: { timing: 0.15, ease: EASE } };
const NORMAL = { params: { timing: 0.25, ease: EASE } };
// @ts-ignore
const SLOW = { params: { timing: 0.4, ease: EASE } };

export const FADE = trigger('fade', [
	transition(':enter', useAnimation(fadeIn, NORMAL)),
	transition(':leave', useAnimation(fadeOut, NORMAL)),
]);

export const FADE_IN = trigger('fadeIn', [
	transition(':enter', useAnimation(fadeIn, NORMAL)),
]);

export const SLIDE_UP = trigger('slideUp', [
	transition(':enter', useAnimation(slideInUp, FAST)),
	transition(':leave', useAnimation(slideOutUp, FAST)),
]);

export const SLIDE_RIGHT = trigger('slideRight', [
	transition(':enter', useAnimation(slideInRight, FAST)),
	transition(':leave', useAnimation(slideOutRight, FAST)),
]);

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
