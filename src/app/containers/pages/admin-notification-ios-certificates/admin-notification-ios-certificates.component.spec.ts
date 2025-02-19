import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminNotificationIosCertificatesComponent } from './admin-notification-ios-certificates.component';

describe('AdminNotificationIosCertificatesComponent', () => {
  let component: AdminNotificationIosCertificatesComponent;
  let fixture: ComponentFixture<AdminNotificationIosCertificatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationIosCertificatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationIosCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
