import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RegionRoutingModule} from "./region-routing.module";
import {RegionComponent} from "./region.component";
import {MapComponent} from "../../../_core/map/map.component";

@NgModule({
  declarations: [
    RegionComponent,
  ],
  imports: [
    CommonModule,
    RegionRoutingModule,
    MapComponent,
  ],
})
export class RegionModule {
}
