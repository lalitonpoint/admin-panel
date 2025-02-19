import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TermsPrivacySettingComponent } from './terms-privacy-setting.component';

describe('TermsPrivacySettingComponent', () => {
  let component: TermsPrivacySettingComponent;
  let fixture: ComponentFixture<TermsPrivacySettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsPrivacySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsPrivacySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
