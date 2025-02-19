import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminAppVersionSettingComponent } from './admin-app-version-setting.component';

describe('AdminAppVersionSettingComponent', () => {
  let component: AdminAppVersionSettingComponent;
  let fixture: ComponentFixture<AdminAppVersionSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAppVersionSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAppVersionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
