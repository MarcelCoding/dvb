import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {RelativeTimePipe} from './_core/relative-time/relative-time.pipe';
import {PortSearchComponent} from './port-search/port-search.component';
import {PortSearchResultComponent} from './port-search-result/port-search-result.component';
import { TimePipe } from './_core/time/time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RelativeTimePipe,
    PortSearchComponent,
    PortSearchResultComponent,
    TimePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  // providers: [{provide: LOCALE_ID, useValue: 'de'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
