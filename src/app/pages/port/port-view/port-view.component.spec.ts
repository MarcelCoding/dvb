import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortViewComponent } from './port-view.component';

describe('PortViewComponent', () => {
  let component: PortViewComponent;
  let fixture: ComponentFixture<PortViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
