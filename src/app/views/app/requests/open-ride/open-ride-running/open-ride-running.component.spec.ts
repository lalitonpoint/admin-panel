import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideRunningComponent } from './open-ride-running.component';

describe('OpenRideRunningComponent', () => {
  let component: OpenRideRunningComponent;
  let fixture: ComponentFixture<OpenRideRunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideRunningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
