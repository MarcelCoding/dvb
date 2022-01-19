import {Component, OnDestroy, OnInit} from '@angular/core';
import {Departure} from "../../../_core/api/api.domain";
import {ApiService} from "../../../_core/api/api.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-port-view',
  templateUrl: './port-view.component.html',
  styleUrls: ['./port-view.component.scss']
})
export class PortViewComponent implements OnInit, OnDestroy {

  public departures?: Departure[];
  private subscription?: Subscription;

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(switchMap(({id}) => this.api.denatures(id)))
      .subscribe(denatures => this.departures = denatures);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
