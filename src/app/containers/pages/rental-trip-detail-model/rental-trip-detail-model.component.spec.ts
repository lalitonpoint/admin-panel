import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalTripDetailModelComponent } from './rental-trip-detail-model.component';

describe('RentalTripDetailModelComponent', () => {
  let component: RentalTripDetailModelComponent;
  let fixture: ComponentFixture<RentalTripDetailModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalTripDetailModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalTripDetailModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
