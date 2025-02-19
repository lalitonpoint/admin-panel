import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentConfigurationsComponent } from './payment-configurations.component';

describe('PaymentConfigurationsComponent', () => {
  let component: PaymentConfigurationsComponent;
  let fixture: ComponentFixture<PaymentConfigurationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
