import {Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, of, switchMap, throwError} from "rxjs";
import {Coordinate} from "ol/coordinate";

export interface Region {
  id: number;
  slug: string;
  name: string;
  x: number;
  z: number;
  zoom: number;
}

type RegionResponse = Record<string, Record<string, { properties: { epsg3857: { x: number, y: number } } }>>

@Injectable({
  providedIn: "root",
})
export class RegionService implements OnDestroy {

  private readonly _regions: Map<number, Region> = new Map<number, Region>();
  private readonly reportingPoints: Map<number, Coordinate> = new Map<number, Coordinate>();
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

  public getReportingPoint(id: number): Coordinate | undefined {
    return this.reportingPoints.get(id);
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
    if (this.region?.slug === slug) {
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

        this.reportingPoints.clear();
        this._regionId.next(region.id);

        return this.http.get<{data: RegionResponse}>(`/assets/region/${(region.id)}.json`)
          .pipe(map(data => ({region, data: data.data[`${region.id}`]})));
      }),
      map(({region, data}) => {
        this.reportingPoints.clear();

        for (const id in data) {
          const {x, y} = data[id].properties.epsg3857;
          this.reportingPoints.set(parseInt(id, 10), [x, y]);
        }

        return region;
      }),
    );
  }

  ngOnDestroy(): void {
    this._regionId.complete();
  }
}
