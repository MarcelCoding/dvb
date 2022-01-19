import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RelativeTimePipe} from "./relative-time/relative-time.pipe";
import {TimePipe} from "./time/time.pipe";

@NgModule({
  declarations: [
    RelativeTimePipe,
    TimePipe
  ],
  exports: [
    RelativeTimePipe,
    TimePipe
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule {
}
