import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideCompletedComponent } from './open-ride-completed.component';

describe('OpenRideCompletedComponent', () => {
  let component: OpenRideCompletedComponent;
  let fixture: ComponentFixture<OpenRideCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
