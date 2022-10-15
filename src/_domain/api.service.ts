import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {map, Observable, of, switchMap, tap} from "rxjs";
import {Junction, Network, Regions, WebsocketEvent} from "./domain";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";

@Injectable({
  providedIn: "root",
})
export class ApiService {

  private regions: Regions | undefined;
  private regionId: number | undefined;
  network: Network | undefined;
  private socket: WebSocketSubject<WebsocketEvent> | undefined;

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  public subscribe(): Observable<WebsocketEvent> {
    return webSocket<WebsocketEvent>("wss://socket.dvb.solutions")
      .pipe(tap(event => {
        const ele = this.network?.[`${event.line}`]?.[`${event.run_number}`];
        if (!ele) {
          return;
        }

        ele.junction = event.junction;
        ele.request_status = event.request_status;
        ele.time_stamp = Number(event.time);
      }));
  }

  private loadRegions(): Observable<void> {
    return this.http.get<{ data: Regions; }>("/assets/stops/all.json")
      .pipe(tap(({data}) => this.regions = data), switchMap(() => of(void 0)));
  }

  public selectRegion(id: number): Observable<Network> {
    this.regionId = undefined;

    const snapshot = this.http.get<{ network: Network }>(`${environment.api}/vehicles/0/all`)
      .pipe(map(({network}) => {
        this.regionId = id;
        this.network = network;
        return network;
      }));

    if (!this.regions) {
      return this.loadRegions()
        .pipe(switchMap(() => snapshot));
    }

    return snapshot;
  }

  public getJunction(id: number, direction: number, request_status: number): Junction | undefined {
    return this.regions?.[`${this.regionId}`]?.[`${id}`]?.find(junction =>
      junction.direction === direction && junction.request_status === request_status,
    );
  }
}
