import {Injectable} from "@angular/core";
import {RegionService} from "./region.service";
import {HttpClient} from "@angular/common/http";

export interface Vehicle {
  line: string;
}

@Injectable({
  providedIn: "root",
})
export class NetworkService {

  constructor(
    private readonly http: HttpClient,
    private readonly location: RegionService,
  ) {
  }
}
