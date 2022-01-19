import {Component, HostBinding, Input} from '@angular/core';
import {Port} from "../../../_core/api/api.domain";

@Component({
  selector: 'app-port-search-result',
  templateUrl: './port-search-result.component.html',
  styleUrls: ['./port-search-result.component.scss']
})
export class PortSearchResultComponent {

  @Input()
  @HostBinding('class.selected')
  public hovered = false;
  @Input()
  public port?: Port;

  public getDisplay(): string | null {
    if (!this.port) {
      return null;
    }

    if (this.port.city) {
      return `${this.port.name}, ${this.port.city}`
    }

    return this.port.name;
  }
}
