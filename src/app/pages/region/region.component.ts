import {AfterViewInit, Component, OnDestroy, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {concat, forkJoin, from, of, Subscription, switchMap, tap} from "rxjs";
import {Region, RegionService} from "../../../_domain/region.service";
import {MapComponent} from "../../../_core/map/map.component";
import {NetworkService, Vehicle} from "../../../_domain/network.service";
import {Point} from "ol/geom";
import {Feature} from "ol";
import {Fill, Stroke, Style, Text, Icon} from "ol/style";

@Component({
  selector: "app-region",
  templateUrl: "./region.component.html",
  styleUrls: ["./region.component.scss"],
})
export class RegionComponent implements AfterViewInit, OnDestroy {

  private subscription: Subscription | undefined;

  @ViewChild(MapComponent)
  private map!: MapComponent;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly regionService: RegionService,
    private readonly networkService: NetworkService,
  ) {
  }

  protected get region(): Region | undefined {
    return this.regionService.region;
  }

  ngAfterViewInit(): void {
    this.subscription = this.route.params
      .pipe(
        switchMap(({id}) => this.regionService.loadRegion(id)),
        tap(region => {
          const {x, z, zoom} = this.route.snapshot.queryParams;

          if (x && z && zoom) {
            this.map.move([x, z], zoom);
          }
          else {
            this.map.move([region.x, region.z], region.zoom);
          }
        }),
        switchMap(() => forkJoin([
          this.map.location.pipe(switchMap(data => this.router.navigate([], {
            queryParams: data,
            queryParamsHandling: "merge",
            replaceUrl: true,
          }))),
          concat(
            this.networkService.loadWholeNetwork().pipe(switchMap(e => from(e))),
            this.networkService.subscribeToUpdates().pipe(tap(console.log)),
          ).pipe(tap(vehicle => this.handleVehicle(vehicle))),
        ])),
      )
      .subscribe({
        error: error => {
          if (error === "NOT_FOUND") this.router.navigate(["/"]).then();
          else console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private handleVehicle(vehicle: Vehicle): void {
    const id = `${vehicle.line}_${vehicle.run}`;

    const feature = this.map.getFeature(id);
    if (feature) {
      feature.setGeometry(new Point(vehicle.coordinate));
      feature.changed();
    }
    else {
      const feature = new Feature({
        geometry: new Point(vehicle.coordinate),
        // TODO: lastSeen: null
      });
      const iconStyle = new Style({
        image: new Icon({src: "/assets/images/vehicle.svg"}),
        text: new Text({
          offsetY: -3,
          text: `${vehicle.line}`,
          fill: new Fill({color: "#000"}),
        }),
      });
      feature.setStyle(iconStyle);

      this.map.setFeature(id, feature);
    }
  }

}
