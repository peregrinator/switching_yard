import { BrowserModule } from '@angular/platform-browser'
import { isDevMode, Inject, Optional, NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { DispatcherService, DISPATCHER_WHITELIST } from 'src/app/core/services/dispatcher.service'

import { AppComponent } from './app.component'

import { ConsoleLogger, LOGGER_OPTIONS, Logger, LoggerOptions, NoOpLogger } from 'src/app/core/utils/logger'

function _loggerFactory(options?: LoggerOptions): Logger {
  options = options || {};
  const enabled = options.enabled != null ? options.enabled : isDevMode();
  if (enabled) {
    const _console: Console = typeof console === 'object' ? console : <any>{};
    const debug = options.debug != null ? options.debug : true;
    return new ConsoleLogger(_console, debug);
  }
  return new NoOpLogger();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    DispatcherService,
    {
      provide: DISPATCHER_WHITELIST, useValue: [
        'PLACEHOLDER_STRING',
      ]
    },
    {
      provide: Logger,
      useFactory: _loggerFactory,
      deps: [[new Inject(LOGGER_OPTIONS), new Optional()]]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
