import {AfterViewInit, Component, OnDestroy, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription, switchMap, tap} from "rxjs";
import {Region, RegionService} from "../../../_domain/region.service";
import {MapComponent} from "../../../_core/map/map.component";

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
        switchMap(() => this.map.location),
        switchMap(data => this.router.navigate([], {queryParams: data, queryParamsHandling: "merge"})),
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
}
