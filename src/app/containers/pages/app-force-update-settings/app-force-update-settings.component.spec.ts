import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppForceUpdateSettingsComponent } from './app-force-update-settings.component';

describe('AppForceUpdateSettingsComponent', () => {
  let component: AppForceUpdateSettingsComponent;
  let fixture: ComponentFixture<AppForceUpdateSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppForceUpdateSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppForceUpdateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
