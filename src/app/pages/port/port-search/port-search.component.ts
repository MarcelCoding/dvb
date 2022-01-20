import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {debounce, filter, interval, Subscription, switchMap} from "rxjs";
import {Port} from "../../../_core/api/api.domain";
import {ApiService} from "../../../_core/api/api.service";

@Component({
  selector: 'app-port-search',
  templateUrl: './port-search.component.html',
  styleUrls: ['./port-search.component.scss']
})
export class PortSearchComponent implements OnInit, OnDestroy {

  public search = new FormControl();
  public searchSubscription?: Subscription;

  public hovered?: number;
  public results?: Port[];

  @Output()
  public selectPort = new EventEmitter<Port>();

  constructor(
    private readonly api: ApiService
  ) {
  }

  ngOnInit(): void {
    this.searchSubscription = this.search.valueChanges
      .pipe(
        debounce(() => interval(300)),
        filter(value => {
          if (value.length < 3) {
            this.results = [];
            this.hovered = undefined;
            return false;
          }

          return true;
        }),
        switchMap(value => this.api.ports(value))
      )
      .subscribe(ports => {
        this.results = ports;
        this.hovered = undefined;
      });
  }

  public ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  public trackBy(index: number, port: Port): string {
    return port.id;
  }

  public onHover(index: number): void {
    this.hovered = index;
  }

  public onSelect(port: Port): void {
    this.search.setValue(port.city ? `${port.name}, ${port.city}` : port.name);
    this.selectPort.emit(port);
  }

  public isSelected(index: number): boolean {
    return this.hovered === index;
  }

  public onSubmit(): void {
    const port = this.results?.[this.hovered ?? 0];
    if (port) {
      this.onSelect(port);
    }
  }

  public onKeyDown(): void {
    if (this.results) {
      if (this.hovered === 0 || (this.hovered && this.hovered !== this.results.length - 1)) {
        this.hovered += 1;
      }
      else {
        this.hovered = 0;
      }
    }
  }

  public onKeyUp(): void {
    if (this.results) {
      if (this.hovered) {
        this.hovered -= 1;
      }
      else {
        this.hovered = this.results.length - 1;
      }
    }
  }
}
