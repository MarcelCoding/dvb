import {Component} from '@angular/core';
import {Port} from "../../_core/api/api.domain";
import {Router} from "@angular/router";

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent {

  constructor(
    private readonly router: Router
  ) {
  }

  public selectPort(port: Port): void {
    this.router.navigate(['port', port.id]).then();
  }
}
