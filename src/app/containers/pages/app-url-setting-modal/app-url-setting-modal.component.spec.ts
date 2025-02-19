import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppUrlSettingModalComponent } from './app-url-setting-modal.component';

describe('AppUrlSettingModalComponent', () => {
  let component: AppUrlSettingModalComponent;
  let fixture: ComponentFixture<AppUrlSettingModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUrlSettingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUrlSettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
