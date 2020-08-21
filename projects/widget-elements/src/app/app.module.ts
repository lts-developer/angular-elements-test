import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { WidgetModule, WidgetComponent } from 'widget';

@NgModule({
  imports: [
    BrowserModule,
    WidgetModule
  ],
  providers: []
})
export class AppModule {
  constructor(private readonly injector: Injector) { }

  ngDoBootstrap() {
    const widget = createCustomElement(WidgetComponent, { injector: this.injector });
    customElements.define("lts-widget", widget);
  }
}