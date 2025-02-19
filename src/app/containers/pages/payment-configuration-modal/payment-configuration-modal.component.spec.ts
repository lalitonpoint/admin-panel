import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentConfigurationModalComponent } from './payment-configuration-modal.component';

describe('PaymentConfigurationModalComponent', () => {
  let component: PaymentConfigurationModalComponent;
  let fixture: ComponentFixture<PaymentConfigurationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentConfigurationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
