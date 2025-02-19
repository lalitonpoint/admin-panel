import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReferralCodeComponent } from './referral-code.component';

describe('ReferralCodeComponent', () => {
  let component: ReferralCodeComponent;
  let fixture: ComponentFixture<ReferralCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
