import { BrowserModule } from '@angular/platform-browser'
import { isDevMode, Inject, Optional, NgModule } from '@angular/core'
import { environment } from 'src/environments/environment'

import { AppRoutingModule } from 'src/app/app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { GraphQLModule } from 'src/app/graphql/graphql.module'
import { HttpClientModule } from '@angular/common/http'

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'
const keycloakService = new KeycloakService()

import { ReactiveFormsModule } from '@angular/forms'

import { DispatcherService, DISPATCHER_WHITELIST } from 'src/app/core/services/dispatcher.service'

import { AppComponent } from 'src/app/app.component'

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
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
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
export class AppModule {
  async ngDoBootstrap(app) {
    const { keycloakConfig, baseUrl } = environment

    keycloakService
      .init({
        config: keycloakConfig,
        bearerPrefix: 'Bearer',
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: baseUrl + '/assets/static/silent-check-sso.html',
        },
        loadUserProfileAtStartUp: false,
      })
      .then(() => {
        console.log('[ngDoBootstrap] bootstrap app')
 
        app.bootstrap(AppComponent)
      })
      .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error))
  }
}
