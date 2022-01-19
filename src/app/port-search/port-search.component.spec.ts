import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortSearchComponent} from './port-search.component';

describe('PortSearchComponent', () => {
  let component: PortSearchComponent;
  let fixture: ComponentFixture<PortSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortSearchComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
