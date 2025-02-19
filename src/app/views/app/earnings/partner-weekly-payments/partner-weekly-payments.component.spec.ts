import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartnerWeeklyPaymentsComponent } from './partner-weekly-payments.component';

describe('PartnerWeeklyPaymentsComponent', () => {
  let component: PartnerWeeklyPaymentsComponent;
  let fixture: ComponentFixture<PartnerWeeklyPaymentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerWeeklyPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerWeeklyPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
