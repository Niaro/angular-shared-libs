import * as fastdomOrigin from 'fastdom';
import * as fastdomPromised from 'fastdom/extensions/fastdom-promised';

const fastdom = fastdomOrigin
	.extend(fastdomPromised);

export default fastdom;
