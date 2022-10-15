import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import RenderEvent from "ol/render/Event";
import {getVectorContext} from "ol/render";
import {Point} from "ol/geom";
import {transform} from "ol/proj";
import {Fill, Stroke, Style, Text} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {toXZ} from "../utils";
import {Coordinate} from "ol/coordinate";

export interface Element {
  getCoordinate(): Coordinate;

  getLabel(): string;
}

@Component({
  selector: "app-map",
  standalone: true,
  imports: [CommonModule],
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, OnDestroy {

  private map: Map | undefined;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  ngOnInit(): void {
    const tileLayer = new TileLayer({source: new OSM()});
    tileLayer.on("postrender", event => this.onPostRender(event));

    this.map = new Map({layers: [tileLayer]});
    this.map.setTarget(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.map?.dispose();
  }

  private onPostRender(event: RenderEvent): void {
    const context = getVectorContext(event);

  }

  public move(lat: number, lon: number, zoom: number): void {
    if (!this.map) {
      return;
    }

    const view = this.map.getView();
    view.setZoom(zoom);
    view.setCenter(toXZ({lat, lon}));
  }
}
