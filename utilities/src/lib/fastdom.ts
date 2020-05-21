import fastdomOrigin from 'fastdom';
import fastdomPromised from 'fastdom/extensions/fastdom-promised';

type IFastdomPromised = {
	clear<T extends Promise<any>>(task: T): void;
	initialize(): void;
	measure<T extends () => void>(task: T, context?: any): Promise<ReturnType<T>>;
	mutate<T extends () => void>(task: T, context?: any): Promise<ReturnType<T>>;
};

const fastdom = <IFastdomPromised>(<any> fastdomOrigin)
	.extend(<any> fastdomPromised);

export {
	fastdom
};
