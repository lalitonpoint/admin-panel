import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripEarningDetailsModalComponent } from './trip-earning-details-modal.component';

describe('TripEarningDetailsModalComponent', () => {
  let component: TripEarningDetailsModalComponent;
  let fixture: ComponentFixture<TripEarningDetailsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripEarningDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripEarningDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
