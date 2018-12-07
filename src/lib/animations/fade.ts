import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn, fadeOut } from 'ng-animate';
import { NORMAL } from './variables';

export const FADE = trigger('fade', [
	transition(':enter', useAnimation(fadeIn, NORMAL)),
	transition(':leave', useAnimation(fadeOut, NORMAL)),
]);

export const FADE_IN = trigger('fadeIn', [
	transition(':enter', useAnimation(fadeIn, NORMAL)),
]);
