import {Injectable} from '@angular/core';
import {Departure, Port} from "./api.domain";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable, take} from "rxjs";

const DVB_DATE = /(\d+)([+-]\d+)/;
const HOUR_IN_MS = 60 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  public ports(query: string): Observable<Port[]> {
    const data = {
      query,
      limit: 10,
      stopsOnly: true
    }

    return this.http.post<PortFinderResponse>(`${environment.apiUrl}/tr/pointfinder`, data)
      .pipe(
        take(1),
        map(data => {
          let ports: Port[] = [];

          for (let point of data.Points) {
            const [id, _, city, name] = point.split("|");
            ports.push({id, city, name})
          }

          return ports;
        })
      );
  }

  public denatures(stopId: string, time?: Date): Observable<Departure[]> {
    const data = {
      stopid: stopId,
      limit: 300,
      time: time ? time.toISOString() : new Date().toISOString()
    }

    return this.http.post<DepartureMonitoreResponse>(`${environment.apiUrl}/dm`, data)
      .pipe(
        take(1),
        map(data => {
          let departures: Departure[] = [];

          for (let departure of data.Departures) {
            const time = departure.RealTime ? parseDate(departure.RealTime) : null;
            const scheduled = parseDate(departure.ScheduledTime);

            departures.push({
              id: departure.Id,
              line: departure.LineName,
              direction: departure.Direction,
              mot: departure.Mot,
              platform: departure.Platform?.Name ?? null,
              time,
              scheduled,
              onTime: time ? time.getTime() === scheduled.getTime() : true
            })
          }

          return departures;
        })
      );
  }
}

function parseDate(value: string): Date {
  const match = value.match(DVB_DATE);

  if (!match) {
    throw new Error("Unable to parse dvb date: " + value);
  }

  const ms = parseInt(match[1], 10);
  const offset = parseInt(match[2], 10) / 100 * HOUR_IN_MS;

  const time = ms + offset;

  return new Date(time);
}

interface PortFinderResponse {
  Points: string[];
}

interface DepartureMonitoreResponse {
  Departures: DepartureResponse[];
}

interface DepartureResponse {
  Id: string;
  LineName: string;
  Direction: string;
  Platform?: {
    Name: string | null;
  },
  Mot: string;
  RealTime?: string;
  ScheduledTime: string;
}
