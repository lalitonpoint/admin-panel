import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmsConfigurationModalComponent } from './sms-configuration-modal.component';

describe('SmsConfigurationModalComponent', () => {
  let component: SmsConfigurationModalComponent;
  let fixture: ComponentFixture<SmsConfigurationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsConfigurationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
