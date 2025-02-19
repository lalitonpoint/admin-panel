import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminLogoSettingsComponent } from './admin-logo-settings.component';

describe('AdminLogoSettingsComponent', () => {
  let component: AdminLogoSettingsComponent;
  let fixture: ComponentFixture<AdminLogoSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLogoSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLogoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
