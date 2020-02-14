import { trigger, transition, useAnimation, style, state } from '@angular/animations';

import { slideInUp, slideOutUp, slideInRight, slideOutRight } from 'ng-animate';

import { FAST, NORMAL } from './variables';

export const SLIDE_UP = trigger('slideUp', [
	transition(':enter', useAnimation(slideInUp, FAST)),
	transition(':leave', useAnimation(slideOutUp, FAST)),
]);

export const STATEFUL_SLIDE_UP = trigger('slideUp', [
	state('on', style({ transform: 'translate3d(0, 0, 0)' })),
	state('off', style({ transform: 'translate3d(0, 100%, 0)' })),
	transition('void => on, off => on', useAnimation(slideInUp, FAST)),
	transition('on => off, off => void', useAnimation(slideOutUp, FAST)),
]);

export const SLIDE_RIGHT = trigger('slideRight', [
	transition(':enter', useAnimation(slideInRight, NORMAL)),
	transition(':leave', useAnimation(slideOutRight, NORMAL)),
]);

export const STATEFUL_SLIDE_RIGHT = trigger('slideRight', [
	state('on', style({ transform: 'translate3d(0, 0, 0)' })),
	state('off', style({ transform: 'translate3d(100%, 0, 0)' })),
	transition('void => on, off => on', useAnimation(slideInRight, NORMAL)),
	transition('on => off, off => void', useAnimation(slideOutRight, NORMAL)),
]);
