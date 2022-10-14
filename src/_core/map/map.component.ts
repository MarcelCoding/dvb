import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import RenderEvent from "ol/render/Event";
import {getVectorContext} from "ol/render";
import {Point} from "ol/geom";
import {transform} from "ol/proj";
import {Fill, Stroke, Style, Text} from "ol/style";
import CircleStyle from "ol/style/Circle";

export interface Element {
  lat: number,
  lon: number,
  text: string,
}

@Component({
  selector: "app-map",
  standalone: true,
  imports: [CommonModule],
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {

  @Input()
  public elements: Element[] | undefined;
  private map: Map | undefined;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  ngOnInit(): void {
    const tileLayer = new TileLayer({source: new OSM()});
    tileLayer.on("postrender", event => this.onPostRender(event));

    this.map = new Map({
      view: new View({
        center: transform([13.7325942, 51.0510431], "EPSG:4326", "EPSG:3857"),
        zoom: 12.5,
      }),
      layers: [tileLayer],
    });
    this.map?.setTarget(this.elementRef.nativeElement);
  }

  private onPostRender(event: RenderEvent): void {
    console.log(this.elements);
    if (!this.elements) {
      return;
    }

    const context = getVectorContext(event);

    for (const element of this.elements) {
      context.setStyle(new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({color: "yellow"}),
          stroke: new Stroke({color: "red", width: 1}),
        }),
        text: new Text({
          text: element.text,
          font: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"",
        }),
      }));

      const circle = new Point(transform([element.lon, element.lat], "EPSG:4326", "EPSG:3857"));
      context.drawPoint(circle);
    }
  }
}
