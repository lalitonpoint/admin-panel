import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideEarningDetailsModalComponent } from './open-ride-earning-details-modal.component';

describe('OpenRideEarningDetailsModalComponent', () => {
  let component: OpenRideEarningDetailsModalComponent;
  let fixture: ComponentFixture<OpenRideEarningDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideEarningDetailsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideEarningDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
