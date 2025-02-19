import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideScheduledComponent } from './open-ride-scheduled.component';

describe('OpenRideScheduledComponent', () => {
  let component: OpenRideScheduledComponent;
  let fixture: ComponentFixture<OpenRideScheduledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideScheduledComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
