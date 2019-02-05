import { isObject, isString, isBoolean, forIn } from 'lodash-es';
import { Dimensions, Size, Position } from '../models/misc/dimensions';

export class $ {
	static addClass($el: Element, ...classes: string[]) {
		for (const cls of classes)
			this.setClass($el, cls, true);
	}

	static removeClass($el: Element, ...classes: string[]) {
		for (const cls of classes)
			this.setClass($el, cls, false);
	}

	static setClass($el: Element, cls: string, isAdd: boolean) {
		if (!cls) return;
		isAdd ? $el.classList.add(cls) : $el.classList.remove(cls);
	}

	static containsClass($el: Element, cls: string) {
		return $el.classList.contains(cls);
	}

	static setAttribute($el: Element, name: string, value: string, isAdd: boolean);
	static setAttribute($el: Element, name: string, isAdd: boolean);
	static setAttribute($el: Element, name: string, valueOrIsAdd: string | boolean, isAdd?: boolean) {
		const value = isString(valueOrIsAdd) ? valueOrIsAdd : name;
		isAdd = isBoolean(valueOrIsAdd) ? valueOrIsAdd : isAdd;
		isAdd ? $el.setAttribute(name, value) : $el.removeAttribute(name);
	}

	// Searching methods
	static siblings(el: Element): Element[] {
		return Array.from(el.parentNode.childNodes).filter(child => child !== el) as Element[];
	}

	static filter(el: Element, selector: string): Element[] {
		return Array.from(el.querySelectorAll(selector)) as Element[];
	}

	static find(selector: string): Element[];
	static find(target: Element, selector?: string): Element[];
	static find(targetOrSelector: Element | string, selector?: string): Element[] {
		if (targetOrSelector instanceof Element)
			return Array.from(targetOrSelector.querySelectorAll(selector)) as Element[];
		return Array.from(document.querySelectorAll(targetOrSelector)) as Element[];
	}

	static findSingle<T = Element>(target: Element | string, selector?: string): T {
		if (target instanceof Element)
			return target.querySelector(selector) as any as T;
		return document.querySelector(<string>target) as any as T;
	}

	static closest(target: Element, selector: string): Element {
		while (target !== document.documentElement) {
			target = target.parentElement;
			if (target.matches(selector))
				return target;
		}
	}

	static hasParent(target: Element, selector: string | Element): boolean {
		while (target !== document.documentElement) {
			target = target.parentElement;
			if (isString(selector) ? target.matches(selector) : target === selector)
				return true;
		}
		return false;
	}

	static is(el: Element, selector: ':visible' | ':hidden'): boolean {
		switch (selector) {
			case ':visible':
				return this.isVisible(el);
			case ':hidden':
				return !this.isVisible(el);
			default:
				throw new Error('Wrong selector has been put in \'IS\' function');
		}
	}

	static isVisible(el: Element): boolean {
		// first check if elem is hidden through css as this is not very costly
		const style = getComputedStyle(el);
		return style.display !== 'none' &&
			style.display !== '' &&
			style.visibility !== 'hidden' &&
			el.getAttribute('type') !== 'hidden' &&
			style.opacity !== '0';
	}

	static css(el: HTMLElement, styleName: string, styleValue: any): void;
	static css(el: HTMLElement, stylesDictionary: { [styleName: string]: any }): void;
	static css(el: HTMLElement, ...styles): void {
		const dictionary = isObject(styles[0]) ? styles[0] : { [styles[0]]: styles[1] };
		forIn(dictionary, (value, style) => el.style[style] = value);
	}

	static attr(el: HTMLElement, attrName: string, attrValue: any): void;
	static attr(el: HTMLElement, attrsDictionary: { [attrName: string]: any }): void;
	static attr(el: HTMLElement, ...attrs): void {
		const dictionary = isObject(attrs[0]) ? attrs[0] : { [attrs[0]]: attrs[1] };
		forIn(dictionary, (value, attr) => el.setAttribute(attr, value));
	}

	static parseCss(cssValue: string): number {
		return Math.ceil(parseFloat(cssValue));
	}

	/**
	 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
	 *
	 * @param {String} text The text to be rendered.
	 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
	 *
	 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
	 */
	static getTextWidth(text: string, font: string) {
		// re-use canvas object for better performance
		const canvas = $.getTextWidth['canvas'] || ($.getTextWidth['canvas'] = document.createElement('canvas'));
		const context = canvas.getContext('2d');
		context.font = font;
		const metrics = context.measureText(text);
		return metrics.width;
	}

	/**
	 * Gets size of element without paddings and borders
	 */
	static innerSize(el: Element): Size {
		const style = getComputedStyle(el);
		return new Size(
			el.clientWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight),
			el.clientHeight - parseInt(style.paddingTop) - parseInt(style.paddingBottom)
		);
	}

	/**
	 * Gets size of element including paddings, borders, and margins
	 */
	static outerSize(el: Element): Size {
		const style = getComputedStyle(el);
		const { width, height } = el.getBoundingClientRect();
		return new Size(
			width + parseInt(style.marginLeft) + parseInt(style.marginRight),
			height + parseInt(style.marginTop) + parseInt(style.marginBottom)
		);
	}

	/**
	 * Get the element coordinates relative to the document
	 */
	static offset(el: Element): Dimensions {
		const { width, height, top, left } = el.getBoundingClientRect();
		return new Dimensions({
			width,
			height,
			top: top + window.scrollY,
			left: left + window.scrollX
		});
	}

	/**
	 * Get the hidden element coordinats relative to the document
	 */
	static offsetHidden(el: HTMLElement): Dimensions {
		let offset: Dimensions;
		if (el.offsetWidth)
			offset = $.offset(el);
		else {
			el.style.visibility = 'hidden';
			el.style.display = '';
			offset = $.offset(el);
			el.style.display = 'none';
			el.style.visibility = '';
		}

		return offset;
	}

	/**
	 * Get the current coordinates of the element relative to the offset parent.
	 */
	static position(el: HTMLElement): Position {
		// Get correct offsets
		const offset = $.offset(el);
		const parentOffset = el.offsetParent instanceof Element ? $.offset(el.offsetParent) : { left: 0, top: 0 };
		const elStyles = getComputedStyle(el);

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top -= parseFloat(elStyles.marginTop) || 0;
		offset.left -= parseFloat(elStyles.marginLeft) || 0;

		if (el.offsetParent) {
			const parentStyles = getComputedStyle(el.offsetParent);
			// Add offsetParent borders
			parentOffset.top += parseFloat(parentStyles.borderTopWidth) || 0;
			parentOffset.left += parseFloat(parentStyles.borderLeftWidth) || 0;
		}

		// Subtract the two offsets
		return new Position({
			top: offset.top - parentOffset.top,
			left: offset.left - parentOffset.left
		});
	}

	static scroll(target: Element | Window, x?: number, y?: number) {
		if (target instanceof Window)
			target.scroll(x, y);
		else {
			target.scrollLeft = x;
			target.scrollTop = y;
		}
	}

	/**
	 * Gets scroll container for the @prop the target element.
	 */
	static getScrollContainer(target: Element): HTMLElement | Window {
		const ScrollValues = ['scroll', 'auto'];
		let parent = target.parentElement;
		while (parent) {
			const { overflow, overflowY, overflowX } = getComputedStyle(parent);
			if (ScrollValues.includes(overflow) || ScrollValues.includes(overflowY) || ScrollValues.includes(overflowX))
				return parent;
			parent = parent.parentElement;
		}
		return window;
	}

	/**
	 * Cleans targetId from '#' and checks on whitespaces
	 * @param  {string} targetId
	 * @return {string}
	 */
	static sanitizeTargetId(targetId: string): string {
		if (/\s+/g.test(targetId))
			throw new Error(`At sanitizeTargetId('${targetId}') target arrgument has not allowed whitespaces`);

		return targetId.replace(/#/, ''); // remove first matched hash symbol
	}

	/**
	 * Gets HTMLElement by targetId if it's presented at the dom and has bounding client rect,
	 * which means target element doesn't have 'display:none' style.
	 * @param  {string}      targetId string which may represent Id of element or it's name
	 * @return {HTMLElement}
	 */
	static getTarget(targetId: string): HTMLElement {
		targetId = this.sanitizeTargetId(targetId);
		const target = targetId && (document.getElementById(targetId) || document.getElementsByName(targetId)[0]);
		if (target && target.getBoundingClientRect)
			return <HTMLElement>target;
	}

	/**
	 * Create Image element with specified url string
	 */
	static createImage(src: string) {
		const img: HTMLImageElement = new HTMLImageElement();
		img.src = src;
		return img;
	}

	/**
	 * Returns content of the meta-tag in head.
	 */
	static getMeta(name: string) {
		const el = this.findSingle(document.head, `meta[name=${name}]`);
		return el ? el.getAttribute('content') : undefined;
	}

	static dispatchEvent(el$: HTMLElement, eventName: string, canBubble: boolean = false, canceable: boolean = false) {
		const event = document.createEvent('Event');
		event.initEvent(eventName, canBubble, canceable);
		el$.dispatchEvent(event);
	}
}
