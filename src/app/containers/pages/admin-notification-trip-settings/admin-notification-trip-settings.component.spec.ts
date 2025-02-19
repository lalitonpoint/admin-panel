import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminNotificationTripSettingsComponent } from './admin-notification-trip-settings.component';

describe('AdminNotificationTripSettingsComponent', () => {
  let component: AdminNotificationTripSettingsComponent;
  let fixture: ComponentFixture<AdminNotificationTripSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationTripSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationTripSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
