import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripPriceComponent } from './trip-price.component';

describe('TripPriceComponent', () => {
  let component: TripPriceComponent;
  let fixture: ComponentFixture<TripPriceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
