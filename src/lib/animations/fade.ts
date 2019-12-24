import { trigger, transition, useAnimation, animation, animate, keyframes, style } from '@angular/animations';
import { NORMAL } from './variables';

const timings = '{{ timing }}s {{ delay }}s {{ease}}';

export const fadeIn = animation(animate(
	timings,
	keyframes([
		style({ opacity: 0 }),
		style({ opacity: 1 })
	])
));

export const fadeOut = animation(animate(
	timings,
	keyframes([
		style({ opacity: 1 }),
		style({ opacity: 0 })
	])
));

export const FADE = trigger('fade', [
	transition(':enter', useAnimation(fadeIn, NORMAL)),
	transition(':leave', useAnimation(fadeOut, NORMAL)),
]);

export const FADE_IN = trigger('fadeIn', [
	transition(':enter', useAnimation(fadeIn, NORMAL)),
]);

export const FADE_OUT = trigger('fadeOut', [
	transition(':leave', useAnimation(fadeOut, NORMAL)),
]);

const floatFadeOut = animation([
	style({ position: 'absolute' }),
	animate(
		timings,
		keyframes([
			style({ opacity: 1 }),
			style({ opacity: 0 })
		])
	)
]);

export const FADE_IN_FLOAT_FADE_OUT = trigger('fadeInFloatFadeOut', [
	transition(':enter', useAnimation(fadeIn, NORMAL)),
	transition(':leave', useAnimation(floatFadeOut, NORMAL)),
]);
