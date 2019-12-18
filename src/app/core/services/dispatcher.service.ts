import { Injectable, Inject, InjectionToken } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { Logger } from 'src/app/core/utils/logger'

export const DISPATCHER_WHITELIST = new InjectionToken<string[]>('DISPATCHER_WHITELIST')

export interface DispatcherSignal {
  type: string;
  value: any;
}

@Injectable()
export class DispatcherService {
  private _subject: Subject<DispatcherSignal>
  private _observable: Observable<DispatcherSignal>

  constructor(
    @Inject(DISPATCHER_WHITELIST) private _whitelist: string[],
    private logger: Logger
  ) {
    this._subject = new Subject<DispatcherSignal>()
    this._observable = this._subject.asObservable()
  }

  next(signal: DispatcherSignal) {
    if (this._whitelist.indexOf(signal.type) === -1) {
      throw 'Dispatcher signal not found: ' + signal.type
    }
    
    this.logger.info('Dispatching: ', signal)

    this._subject.next(signal)
  }

  observe(values: string[]): Observable<DispatcherSignal> {
    for (let value of values) {
      if (this._whitelist.indexOf(value) === -1) {
        throw 'Dispatcher signal not found: ' + value
      }
    }
    return this._observable.pipe(filter(signal => values.indexOf(signal.type) !== -1))
  }
}