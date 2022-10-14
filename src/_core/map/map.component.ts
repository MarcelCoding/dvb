import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import WebGLTile from 'ol/layer/WebGLTile';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styleUrls: ['./map.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {

  private map: Map | undefined;

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) {
  }

  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      layers: [
        new WebGLTile({
          source: new OSM(),
        }),
      ],
    });
    this.map?.setTarget(this.elementRef.nativeElement);
  }
}
