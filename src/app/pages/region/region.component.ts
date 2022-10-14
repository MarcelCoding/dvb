import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {mergeMap, Subscription} from "rxjs";
import {ApiService} from "../../../_domain/api.service";
import {Network} from "../../../_domain/domain";
import {Element} from "../../../_core/map/map.component";
import {ObjectEvent} from "ol/Object";

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit, OnDestroy {

  public data: Network | undefined;
  protected elements: Element[] = [];
  private subscription: Subscription | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly apiService: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      mergeMap(({id}) => this.apiService.selectRegion(id))
    )
      .subscribe(data => {
        this.data = data;

        for (let line of Object.values(this.data)) {
          for (let run of Object.values(line)) {
            const junction = this.apiService.getJunction(run.junction, run.direction, run.request_status);
            if (junction) {
              this.elements.push({lat: junction.lat, lon: junction.lon, text: `${run.line}`});
            }
          }
        }

        console.log(this.data)
        console.log(this.elements)
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
