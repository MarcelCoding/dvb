import {Component, HostBinding, Input} from '@angular/core';
import {Port} from "../_core/api/api.domain";

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
}
