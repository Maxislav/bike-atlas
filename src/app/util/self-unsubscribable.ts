import {Injectable, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SelfUnsubscribable implements OnDestroy {
  onDestroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
