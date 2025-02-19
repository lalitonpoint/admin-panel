import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideTripDetailsModalComponent } from './open-ride-trip-details-modal.component';

describe('OpenRideTripDetailsModalComponent', () => {
  let component: OpenRideTripDetailsModalComponent;
  let fixture: ComponentFixture<OpenRideTripDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideTripDetailsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideTripDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
