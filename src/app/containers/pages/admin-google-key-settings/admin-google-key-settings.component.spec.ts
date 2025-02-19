import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminGoogleKeySettingsComponent } from './admin-google-key-settings.component';

describe('AdminGoogleKeySettingsComponent', () => {
  let component: AdminGoogleKeySettingsComponent;
  let fixture: ComponentFixture<AdminGoogleKeySettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGoogleKeySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGoogleKeySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
