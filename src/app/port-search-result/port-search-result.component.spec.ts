import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortSearchResultComponent} from './port-search-result.component';

describe('PortSearchResultComponent', () => {
  let component: PortSearchResultComponent;
  let fixture: ComponentFixture<PortSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortSearchResultComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
