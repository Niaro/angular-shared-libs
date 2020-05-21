import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AsyncVoidSubject } from '@bp/shared/rxjs';

export abstract class Destroyable implements OnDestroy {

	readonly destroyed$ = new AsyncVoidSubject();

	ngOnDestroy() {
		this.destroyed$.complete();
	}

	takeUntilDestroyed = <T>(source$: Observable<T>) => source$
		.pipe(takeUntil(this.destroyed$));

}
