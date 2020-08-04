// tslint:disable-next-line: no-unnecessary-type-annotation
export const requestIdleCallback: RequestIdleCallback = window.requestIdleCallback || function(handler) {
	const startTime = Date.now();

	return setTimeout(
		() => handler({
			didTimeout: false,
			timeRemaining: () => Math.max(0, 50 - (Date.now() - startTime))
		}),
		1
	);
};

// tslint:disable-next-line: no-unnecessary-type-annotation
export const cancelIdleCallback: CancelIdleCallback = window.cancelIdleCallback || function(id) {
	clearTimeout(id);
};

export type RequestIdleCallbackId = number;
type RequestIdleCallbackOptions = {
	timeout: number;
};
type RequestIdleCallbackDeadline = {
	readonly didTimeout: boolean;
	timeRemaining: (() => number);
};

type RequestIdleCallbackHandler = (deadline: RequestIdleCallbackDeadline) => void;

type RequestIdleCallback = (
	callback: RequestIdleCallbackHandler,
	opts?: RequestIdleCallbackOptions,
) => RequestIdleCallbackId;

type CancelIdleCallback = (id: RequestIdleCallbackId) => void;

declare global {
	// tslint:disable-next-line: naming-convention
	interface Window {// tslint:disable-line: interface-name
		requestIdleCallback: RequestIdleCallback;
		cancelIdleCallback: CancelIdleCallback;
	}
}
