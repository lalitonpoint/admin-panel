import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmsConnectModalComponent } from './sms-connect-modal.component';

describe('SmsConnectModalComponent', () => {
  let component: SmsConnectModalComponent;
  let fixture: ComponentFixture<SmsConnectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsConnectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsConnectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
