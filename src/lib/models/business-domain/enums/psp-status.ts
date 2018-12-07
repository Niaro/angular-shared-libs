import { Enumeration } from '../../misc';

export class PspStatus extends Enumeration {
	static active = new PspStatus();
	static disabled = new PspStatus();
}
