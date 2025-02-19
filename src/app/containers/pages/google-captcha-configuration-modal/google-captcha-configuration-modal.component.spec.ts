import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCaptchaConfigurationModalComponent } from './google-captcha-configuration-modal.component';

describe('GoogleCaptchaConfigurationModalComponent', () => {
  let component: GoogleCaptchaConfigurationModalComponent;
  let fixture: ComponentFixture<GoogleCaptchaConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleCaptchaConfigurationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleCaptchaConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
