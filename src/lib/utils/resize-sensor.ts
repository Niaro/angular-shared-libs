import fastdom from './fastdom';
import { Dictionary } from 'lodash';
import { isFunction } from 'lodash-es';

type SizeInfo = {
	width: number;
	height: number;
};

type OnResize = (sizeInfo: SizeInfo) => void;

type HTMLDivResetSensorElement = HTMLDivElement & { resetSensor?: Function };

type HTMLResizableElement = HTMLElement & {
	resizedAttached?: EventQueue,
	resizeSensor?: HTMLDivResetSensorElement
};

export class ResizeSensor {
	static reset(element: HTMLResizableElement | HTMLResizableElement[]) {
		this.forEachElement(element, $el => $el.resizeSensor && $el.resizeSensor.resetSensor());
	}

	static detach(element: HTMLResizableElement | HTMLResizableElement[], cb: OnResize) {
		this.forEachElement(element, $el => {
			if (!$el) return;

			if ($el.resizedAttached && isFunction(cb))
				$el.resizedAttached.remove(cb);

			if ($el.resizeSensor && !$el.resizedAttached.length) {
				$el.contains($el.resizeSensor) && $el.removeChild($el.resizeSensor);
				delete $el.resizeSensor;
				delete $el.resizedAttached;
			}
		});
	}

	private static forEachElement(elements: HTMLResizableElement | HTMLResizableElement[], cb: ($el: HTMLResizableElement) => void) {
		const elementsType = Object.prototype.toString.call(elements);
		const isCollectionTyped = ('[object Array]' === elementsType
			|| ('[object NodeList]' === elementsType)
			|| ('[object HTMLCollection]' === elementsType)
			|| ('[object Object]' === elementsType)
		);

		if (isCollectionTyped)
			(<HTMLResizableElement[]>elements).forEach(v => cb(v));
		else
			cb(elements as HTMLResizableElement);
	}

	private elements: HTMLResizableElement | HTMLResizableElement[];

	constructor(element: HTMLElement | HTMLElement[], cb: OnResize) {
		this.elements = element;
		ResizeSensor.forEachElement(element, $el => this.attachResizeEvent($el, cb));
	}

	detach(cb: OnResize) {
		ResizeSensor.detach(this.elements, cb);
	}

	reset() {
		ResizeSensor.reset(this.elements);
	}

	private async attachResizeEvent(
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

		const $resizeSensor = $el.resizeSensor = document.createElement('div') as HTMLDivResetSensorElement;
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

		this.setStyle($resizeSensor, style);

		const $expand = document.createElement('div');
		$expand.className = 'resize-sensor-expand';
		this.setStyle($expand, style);

		const $expandChild = document.createElement('div');
		this.setStyle($expandChild, styleChild);
		$expand.appendChild($expandChild);

		const $shrink = document.createElement('div');
		$shrink.className = 'resize-sensor-shrink';
		this.setStyle($shrink, style);

		const $shrinkChild = document.createElement('div');
		this.setStyle($shrinkChild, { ...styleChild, width: '200%', height: '200%' });
		$shrink.appendChild($shrinkChild);

		$resizeSensor.appendChild($expand);
		$resizeSensor.appendChild($shrink);
		$el.appendChild($resizeSensor);

		const computedStyle = await fastdom
			.measure(() => window.getComputedStyle($el));

		const position = computedStyle ? computedStyle.position : null;
		if ('absolute' !== position && 'relative' !== position && 'fixed' !== position)
			await fastdom.mutate(() => $el.style.position = 'relative');

		let dirty, rafId;
		let size: SizeInfo = await this.getElementSize($el);
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
				} else
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
			size = await this.getElementSize($el);
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

	private setStyle(element: HTMLElement, style: Dictionary<string>) {
		return fastdom.mutate(() => Object.keys(style).forEach(k => element.style[k] = style[k]));
	}

	private async getElementSize(element: HTMLElement) {
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
				const $el = record.addedNodes[j] as HTMLResizableElement;
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
	private q: OnResize[] = [];

	get length() { return this.q.length; }

	add(ev: OnResize) {
		this.q.push(ev);
	}

	call(sizeInfo: SizeInfo) {
		this.q.forEach(ev => ev.call(this, sizeInfo));
	}

	remove(ev: OnResize) {
		this.q = this.q.filter(v => v !== ev);
	}
}
