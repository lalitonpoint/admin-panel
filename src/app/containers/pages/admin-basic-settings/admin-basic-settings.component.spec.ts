import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminBasicSettingsComponent } from './admin-basic-settings.component';

describe('AdminBasicSettingsComponent', () => {
  let component: AdminBasicSettingsComponent;
  let fixture: ComponentFixture<AdminBasicSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBasicSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBasicSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
