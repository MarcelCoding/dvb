import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, of, Subscription, switchMap, throwError} from "rxjs";
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
    this.route.params
      .pipe(switchMap(({id}) => this.regionService.loadRegion(id)))
      .subscribe({
        next: region => this.map.move(region.lat, region.lon, region.zoom),
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
