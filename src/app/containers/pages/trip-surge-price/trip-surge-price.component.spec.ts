import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripSurgePriceComponent } from './trip-surge-price.component';

describe('TripSurgePriceComponent', () => {
  let component: TripSurgePriceComponent;
  let fixture: ComponentFixture<TripSurgePriceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripSurgePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripSurgePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
