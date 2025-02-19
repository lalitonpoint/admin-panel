import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalRequestReportComponent } from './rental-request-report.component';

describe('RentalRequestReportComponent', () => {
  let component: RentalRequestReportComponent;
  let fixture: ComponentFixture<RentalRequestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalRequestReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
