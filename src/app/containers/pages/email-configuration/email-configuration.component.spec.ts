import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailConfigurationComponent } from './email-configuration.component';

describe('EmailConfigurationComponent', () => {
  let component: EmailConfigurationComponent;
  let fixture: ComponentFixture<EmailConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
