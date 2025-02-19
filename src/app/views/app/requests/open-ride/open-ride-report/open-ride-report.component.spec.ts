import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideReportComponent } from './open-ride-report.component';

describe('OpenRideReportComponent', () => {
  let component: OpenRideReportComponent;
  let fixture: ComponentFixture<OpenRideReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
