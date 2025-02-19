import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideTripEarningComponent } from './open-ride-trip-earning.component';

describe('OpenRideTripEarningComponent', () => {
  let component: OpenRideTripEarningComponent;
  let fixture: ComponentFixture<OpenRideTripEarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideTripEarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideTripEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
