import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminFirebaseGCMKeySettingsComponent } from './admin-firebase-gcm-key-settings.component';

describe('AdminFirebaseGCMKeySettingsComponent', () => {
  let component: AdminFirebaseGCMKeySettingsComponent;
  let fixture: ComponentFixture<AdminFirebaseGCMKeySettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFirebaseGCMKeySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFirebaseGCMKeySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
