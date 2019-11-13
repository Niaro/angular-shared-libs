import { trigger, transition, useAnimation, animation, animate, keyframes, style } from '@angular/animations';
import { NORMAL } from './variables';

const timings = '{{ timing }}s {{ delay }}s {{ease}}';

const fadeIn = animation(animate(
	timings,
	keyframes([
		style({ opacity: 0 }),
		style({ opacity: 1 })
	])
));

const fadeOut = animation(animate(
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
