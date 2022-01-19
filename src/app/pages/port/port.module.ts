import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortRoutingModule } from './port-routing.module';
import { PortComponent } from './port.component';
import { PortViewComponent } from './port-view/port-view.component';
import { NoPortComponent } from './no-port/no-port.component';
import {AppModule} from "../../app.module";
import {ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../_core/core.module";
import {PortSearchComponent} from "./port-search/port-search.component";
import {PortSearchResultComponent} from "./port-search-result/port-search-result.component";


@NgModule({
  declarations: [
    PortComponent,
    PortViewComponent,
    NoPortComponent,
    PortSearchComponent,
    PortSearchResultComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortRoutingModule,
    CoreModule
  ]
})
export class PortModule { }
