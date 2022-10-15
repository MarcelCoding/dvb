import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {map, mergeMap, Subscription, switchMap} from "rxjs";
import {ApiService} from "../../../_domain/api.service";
import {Network} from "../../../_domain/domain";
import {Element} from "../../../_core/map/map.component";

@Component({
  selector: "app-region",
  templateUrl: "./region.component.html",
  styleUrls: ["./region.component.scss"],
})
export class RegionComponent implements OnInit, OnDestroy {

  protected data: Network | undefined;
  protected elements: Element[] = [];
  private subscription: Subscription | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly apiService: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      mergeMap(({id}) => this.apiService.selectRegion(id)),
      switchMap(() => this.apiService.subscribe()),
      map(() => this.apiService.network!),
    )
      .subscribe(data => {
        this.data = data;
        this.elements.length = 0;

        for (const line of Object.values(this.data)) {
        const unknown = [];
          for (const run of Object.values(line)) {
            const junction = this.apiService.getJunction(run.junction, run.direction, run.request_status);
            if (junction) {
              this.elements.push({lat: junction.lat, lon: junction.lon, text: `${run.line}`});
            }
            else {
              console.log("Couldn't find a junction.", run);
              unknown.push(run);
            }
          }
          for (let u of unknown) {
            delete line[`${u.run_number}`];
          }
        }

        console.log(this.data);
        console.log(this.elements);
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
