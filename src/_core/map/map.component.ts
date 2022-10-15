import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import {Coordinate} from "ol/coordinate";
import {View} from "ol";
import {debounceTime, distinct, Subject} from "rxjs";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export interface Location {
  x: number;
  z: number;
  zoom: number;
}

@Component({
  selector: "app-map",
  standalone: true,
  imports: [CommonModule],
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, OnDestroy {

  private vectorSource: VectorSource | undefined;
  private map: Map | undefined;

  private readonly location0: Subject<Location> = new Subject<Location>();
  public readonly location = this.location0.pipe(distinct(), debounceTime(50));

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  ngOnInit(): void {
    const onLocationChange = () => {
      const center = view.getCenter() ?? [0, 0];

      this.location0.next({
        x: Math.round(center[0]),
        z: Math.round(center[1]),
        zoom: Math.round((view.getZoom() ?? 0) * 100) / 100,
      });
    };

    const view = new View();
    view.on("change:resolution", onLocationChange);
    view.on("change:center", onLocationChange);

    this.vectorSource = new VectorSource();

    this.map = new Map({
      view,
      layers: [
        new TileLayer({source: new OSM()}),
        new VectorLayer({source: this.vectorSource}),
      ],
    });
    this.map.setTarget(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.map?.dispose();
  }

  public move(coordinate: Coordinate, zoom: number): void {
    if (!this.map) {
      return;
    }

    const view = this.map.getView();
    view.setZoom(zoom);
    view.setCenter(coordinate);
  }
}
