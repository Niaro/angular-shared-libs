import { Directive, OnDestroy } from '@angular/core';
import { AsyncVoidSubject } from '@bp/shared/rxjs';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class Destroyable implements OnDestroy {

	readonly destroyed$ = new AsyncVoidSubject();

	ngOnDestroy() {
		this.destroyed$.complete();
	}

	takeUntilDestroyed = <T>(source$: Observable<T>) => source$
		.pipe(takeUntil(this.destroyed$));

}
