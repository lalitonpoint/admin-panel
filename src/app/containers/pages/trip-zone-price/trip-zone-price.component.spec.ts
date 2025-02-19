import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripZonePriceComponent } from './trip-zone-price.component';

describe('TripZonePriceComponent', () => {
  let component: TripZonePriceComponent;
  let fixture: ComponentFixture<TripZonePriceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripZonePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripZonePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
