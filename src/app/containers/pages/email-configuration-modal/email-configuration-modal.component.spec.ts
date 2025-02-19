import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailConfigurationModalComponent } from './email-configuration-modal.component';

describe('EmailConfigurationModalComponent', () => {
  let component: EmailConfigurationModalComponent;
  let fixture: ComponentFixture<EmailConfigurationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailConfigurationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
