import {Injectable} from "@angular/core";
import {RegionService} from "./region.service";
import {HttpClient} from "@angular/common/http";
import {filter, map, Observable, of, tap} from "rxjs";
import {environment} from "../environments/environment";
import {Coordinate} from "ol/coordinate";
import {webSocket} from "rxjs/webSocket";
import {TEXT_ALIGN} from "ol/render/canvas/TextBuilder";
import right = TEXT_ALIGN.right;

export interface Vehicle {
  line: string;
  run: number;
  coordinate: Coordinate,
}

interface NetworkEntry {
  last_update: string;
  reporting_point: number;
  line: string;
  run_number: number;
}

type Network = Record<string, Record<string, NetworkEntry>>;

@Injectable({
  providedIn: "root",
})
export class NetworkService {

  constructor(
    private readonly http: HttpClient,
    private readonly regionService: RegionService,
  ) {
  }

  public loadWholeNetwork(): Observable<Vehicle[]> {
    const regionId = this.regionService.regionId.value;
    if (regionId === undefined) {
      return of([]);
    }

    return this.http.get<{ network: Network }>(`${environment.api}/vehicles/${regionId}/all`)
      .pipe(map(({network}) => {
        const vehicles = [];

        for (const line of Object.values(network)) {
          for (const run of Object.values(line)) {
            const coordinate = this.regionService.getReportingPoint(run.reporting_point);
            if (!coordinate) {
              console.log(`Couldn't find coordinates for reporting point: ${run.reporting_point}`);
              continue;
            }
            console.log(run.line, run.run_number, coordinate);

            vehicles.push({
              line: run.line,
              run: run.run_number,
              coordinate,
            });
          }
        }

        return vehicles;
      }));
  }

  public subscribeToUpdates(): Observable<Vehicle> {
    // TODO: filter for region
    return webSocket<{ line: string, run_number: number, reporting_point: number }>(environment.live)
      .pipe(
        map(data => ({
          line: data.line,
          run: data.run_number,
          coordinate: this.regionService.getReportingPoint(data.reporting_point),
        })),
        // remove unknown reporting points
        filter(({coordinate}) => Boolean(coordinate)),
        // hacky typing workaround
        map(data => ({line: data.line, run: data.run, coordinate: data.coordinate!})),
      );
  }
}
