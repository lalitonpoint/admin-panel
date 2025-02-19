import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCaptchaConfigurationComponent } from './google-captcha-configuration.component';

describe('GoogleCaptchaConfigurationComponent', () => {
  let component: GoogleCaptchaConfigurationComponent;
  let fixture: ComponentFixture<GoogleCaptchaConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleCaptchaConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleCaptchaConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
