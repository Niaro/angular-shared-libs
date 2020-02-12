import { isFunction } from 'lodash-es';

import fastdom from './fastdom';

type SizeInfo = {
	width: number;
	height: number;
};

type OnResize = (sizeInfo: SizeInfo) => void;

type HTMLDivResetSensorElement = HTMLDivElement & { resetSensor?: Function; };

type HTMLResizableElement = HTMLElement & {
	resizedAttached?: EventQueue,
	resizeSensor?: HTMLDivResetSensorElement;
};

export class ResizeSensor {
	static reset(element: HTMLResizableElement | HTMLResizableElement[]) {
		ResizeSensor._forEachElement(element, $el => $el.resizeSensor
			&& $el.resizeSensor.resetSensor
			&& $el.resizeSensor.resetSensor()
		);
	}

	static detach(element: HTMLResizableElement | HTMLResizableElement[], cb: OnResize) {
		ResizeSensor._forEachElement(element, $el => {
			if (!$el || !$el.resizedAttached) return;

			if ($el.resizedAttached && isFunction(cb))
				$el.resizedAttached.remove(cb);

			if (!$el.resizeSensor || !!$el.resizedAttached.length)
				return;

			$el.contains($el.resizeSensor) && $el.removeChild($el.resizeSensor);
			delete $el.resizeSensor;
			delete $el.resizedAttached;
		});
	}

	private static _forEachElement(elements: HTMLResizableElement | HTMLResizableElement[], cb: ($el: HTMLResizableElement) => void) {
		const elementsType = Object.prototype.toString.call(elements);
		const isCollectionTyped = ('[object Array]' === elementsType
			|| ('[object NodeList]' === elementsType)
			|| ('[object HTMLCollection]' === elementsType)
			|| ('[object Object]' === elementsType)
		);

		if (isCollectionTyped)
			(<HTMLResizableElement[]>elements).forEach(v => cb(v));
		else
			cb(<HTMLResizableElement>elements);
	}

	private _elements: HTMLResizableElement | HTMLResizableElement[];

	constructor(element: HTMLElement | HTMLElement[], cb: OnResize) {
		this._elements = element;
		ResizeSensor._forEachElement(element, $el => this._attachResizeEvent($el, cb));
	}

	detach(cb: OnResize) {
		ResizeSensor.detach(this._elements, cb);
	}

	reset() {
		ResizeSensor.reset(this._elements);
	}

	private async _attachResizeEvent(
		$el: HTMLResizableElement,
		resized: OnResize
	) {
		if (!$el) return;

		if ($el.resizedAttached) {
			$el.resizedAttached.add(resized);
			return;
		}

		$el.resizedAttached = new EventQueue();
		$el.resizedAttached.add(resized);

		const $resizeSensor = $el.resizeSensor = <HTMLDivResetSensorElement>document.createElement('div');
		$resizeSensor.dir = 'ltr';
		$resizeSensor.className = 'resize-sensor';

		const style = {
			pointerEvents: 'none',
			position: 'absolute',
			left: '0px',
			top: '0px',
			right: '0px',
			bottom: '0px',
			overflow: 'hidden',
			zIndex: '-1',
			visibility: 'hidden',
			maxWidth: '100%'
		};

		const styleChild = {
			position: 'absolute',
			left: '0px',
			top: '0px',
			transition: '0s',
		};

		this._setStyle($resizeSensor, style);

		const $expand = document.createElement('div');
		$expand.className = 'resize-sensor-expand';
		this._setStyle($expand, style);

		const $expandChild = document.createElement('div');
		this._setStyle($expandChild, styleChild);
		$expand.appendChild($expandChild);

		const $shrink = document.createElement('div');
		$shrink.className = 'resize-sensor-shrink';
		this._setStyle($shrink, style);

		const $shrinkChild = document.createElement('div');
		this._setStyle($shrinkChild, { ...styleChild, width: '200%', height: '200%' });
		$shrink.appendChild($shrinkChild);

		$resizeSensor.appendChild($expand);
		$resizeSensor.appendChild($shrink);
		$el.appendChild($resizeSensor);

		const computedStyle = await fastdom
			.measure(() => window.getComputedStyle($el));

		const position = computedStyle ? computedStyle.position : null;
		if ('absolute' !== position && 'relative' !== position && 'fixed' !== position)
			await fastdom.mutate(() => $el.style.position = 'relative');

		let dirty: boolean, rafId: number;
		let size: SizeInfo = await this._getElementSize($el);
		let lastWidth = 0;
		let lastHeight = 0;
		let initialHiddenCheck = true;
		let lastAnimationFrame = 0;

		const resetExpandShrink = async () => {
			const { width, height } = await fastdom.measure(() => ({ width: $el.offsetWidth, height: $el.offsetHeight }));

			await fastdom.mutate(() => {
				$expandChild.style.width = (width + 10) + 'px';
				$expandChild.style.height = (height + 10) + 'px';

				$expand.scrollLeft = width + 10;
				$expand.scrollTop = height + 10;

				$shrink.scrollLeft = width + 10;
				$shrink.scrollTop = height + 10;
			});
		};

		const reset = async () => {
			// Check if element is hidden
			if (initialHiddenCheck) {
				const isInvisible = await fastdom.measure(() => $el.offsetWidth === 0 && $el.offsetHeight === 0);
				if (isInvisible) {
					// Check in next frame
					if (!lastAnimationFrame)
						lastAnimationFrame = requestAnimationFrame(() => {
							lastAnimationFrame = 0;
							reset();
						});

					return;
				}
				// Stop checking
				initialHiddenCheck = false;
			}

			resetExpandShrink();
		};

		$resizeSensor.resetSensor = reset;

		const onResized = () => {
			rafId = 0;

			if (!dirty) return;

			lastWidth = size.width;
			lastHeight = size.height;

			$el.resizedAttached && $el.resizedAttached.call(size);
		};

		const onScroll = async () => {
			size = await this._getElementSize($el);
			dirty = size.width !== lastWidth || size.height !== lastHeight;

			if (dirty && !rafId)
				rafId = requestAnimationFrame(onResized);

			reset();
		};

		$expand.addEventListener('scroll', onScroll);
		$shrink.addEventListener('scroll', onScroll);

		// Fix for custom Elements
		requestAnimationFrame(reset);
	}

	private _setStyle(element: HTMLElement, style: Partial<CSSStyleDeclaration>) {
		return fastdom.mutate(() => Object
			.keys(style)
			.map(v => <number><unknown>v)
			.forEach(k => element.style[k] = (<Required<CSSStyleDeclaration>>style)[k])
		);
	}

	private async _getElementSize(element: HTMLElement) {
		const rect = await fastdom.measure(() => element.getBoundingClientRect());
		return {
			width: Math.round(rect.width),
			height: Math.round(rect.height)
		};
	}
}

if (typeof MutationObserver !== 'undefined') {
	const observer = new MutationObserver(mutations => {
		for (let i = 0; i < mutations.length; i++) {
			const record = mutations[i];
			for (let j = 0; j < record.addedNodes.length; j++) {
				const $el = <HTMLResizableElement>record.addedNodes[j];
				$el.resizeSensor && $el.resizeSensor.resetSensor && $el.resizeSensor.resetSensor();
			}
		}
	});

	document.addEventListener('DOMContentLoaded', () => observer.observe(document.body, {
		childList: true,
		subtree: true,
	}));
}

class EventQueue {
	private _q: OnResize[] = [];

	get length() { return this._q.length; }

	add(ev: OnResize) {
		this._q.push(ev);
	}

	call(sizeInfo: SizeInfo) {
		this._q.forEach(ev => ev.call(this, sizeInfo));
	}

	remove(ev: OnResize) {
		this._q = this._q.filter(v => v !== ev);
	}
}
