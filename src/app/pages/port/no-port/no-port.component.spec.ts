import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPortComponent } from './no-port.component';

describe('NoPortComponent', () => {
  let component: NoPortComponent;
  let fixture: ComponentFixture<NoPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoPortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
