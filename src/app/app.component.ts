import {Component} from '@angular/core';
import {ApiService} from "./_core/api/api.service";
import {Departure, Port} from "./_core/api/api.domain";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public departures?: Departure[];

  constructor(
    private api: ApiService
  ) {
    this.update("33000742");
  }

  private update(portId: string): void {
    this.api.denatures(portId)
      .subscribe(denatures => this.departures = denatures);
  }

  public selectPort(port: Port): void {
    this.update(port.id);
  }
}
