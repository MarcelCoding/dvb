import {Component, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterLinkWithHref} from "@angular/router";
import {Region, RegionService} from "../../../_domain/region.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription | undefined;
  protected regions: Region[] | undefined;

  constructor(
    private readonly regionService: RegionService,
  ) {
  }

  ngOnInit(): void {
    if (this.regionService.regions.size === 0) {
      this.subscription = this.regionService.loadRegions()
        .subscribe(regions => this.regions = regions);
    }
    else {
      this.regions = [];
      for (const region of this.regionService.regions.values()) {
        this.regions.push(region);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected trackBy(index: number, {id}: Region): number {
    return id;
  }
}
