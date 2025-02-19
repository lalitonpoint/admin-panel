import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideComponent } from './open-ride.component';

describe('OpenRideComponent', () => {
  let component: OpenRideComponent;
  let fixture: ComponentFixture<OpenRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
