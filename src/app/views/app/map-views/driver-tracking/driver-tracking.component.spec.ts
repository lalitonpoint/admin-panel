import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DriverTrackingComponent } from './driver-tracking.component';

describe('DriverTrackingComponent', () => {
  let component: DriverTrackingComponent;
  let fixture: ComponentFixture<DriverTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
