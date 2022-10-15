import {Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, of, switchMap, tap, throwError} from "rxjs";
import {transform} from "ol/proj";

export interface Region {
  id: number;
  slug: string;
  name: string;
  lat: number;
  lon: number;
  zoom: number;
}

export interface Location {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: "root",
})
export class RegionService implements OnDestroy {

  private readonly _regions: Map<number, Region> = new Map<number, Region>();
  private readonly locations: Map<number, Location> = new Map<number, Location>();
  private readonly _regionId: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  get regions(): Map<number, Region> {
    return this._regions;
  }

  get regionId(): BehaviorSubject<number | undefined> {
    return this._regionId;
  }

  get region(): Region | undefined {
    const id = this._regionId.value;
    return id === undefined ? undefined : this.regions.get(id);
  }

  public getLocation(id: number): Location | undefined {
    return this.locations.get(id);
  }

  public loadRegions(): Observable<Region[]> {
    return this.http.get<Region[]>("/assets/regions.json")
      .pipe(map(regions => {
        this.regions.clear();
        for (const region of regions) {
          this._regions.set(region.id, region);
        }
        return regions;
      }));
  }

  public loadRegion(slug: string): Observable<Region> {
    if(this.region?.slug === slug) {
      return of(this.region);
    }

    const regions = this.regions.size
      ? of(this._regions.values())
      : this.loadRegions().pipe(map(regions => regions[Symbol.iterator]()));

    return regions.pipe(
      map(regions => {
        for (const region of regions) {
          if (region.slug === slug) {
            return region;
          }
        }

        return undefined;
      }),
      switchMap(region => {
        if (!region) {
          return throwError(() => "NOT_FOUND");
        }

        this.locations.clear();
        this._regionId.next(region.id);

        return this.http.get<Record<string, Location>>(`/assets/region/${(region.id)}.json`)
          .pipe(map(data => ({region, data})));
      }),
      map(({region, data}) => {
        this.locations.clear();

        for (const id in data) {
          this.locations.set(parseInt(id, 10), data[id]);
        }

        return region;
      }),
    );
  }

  ngOnDestroy(): void {
    this._regionId.complete();
  }
}
