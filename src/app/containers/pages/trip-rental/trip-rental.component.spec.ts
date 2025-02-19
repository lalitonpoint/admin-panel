import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripRentalComponent } from './trip-rental.component';

describe('TripRentalComponent', () => {
  let component: TripRentalComponent;
  let fixture: ComponentFixture<TripRentalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripRentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
