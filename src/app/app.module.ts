import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { DispatcherService, DISPATCHER_WHITELIST } from 'src/app/core/services/dispatcher.service'

import { AppComponent } from './app.component'

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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
